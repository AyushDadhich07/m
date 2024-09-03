import os
import logging
import uuid
import boto3
import io
from io import BytesIO
import requests
import tempfile
import time
import pickle
from .models import Document, ProcessedDocument
from botocore.exceptions import NoCredentialsError, ClientError
from django.core.exceptions import ObjectDoesNotExist
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize AWS S3 client
s3_client = boto3.client('s3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_S3_REGION_NAME")
)

s3_bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
s3_region = os.getenv("AWS_S3_REGION_NAME")
openai_api_key = os.getenv("OPENAI_API_KEY")

def process_document(file_source):
    """
    Process a document from a URL or S3 object.
    """
    try:
        if file_source.startswith("http://") or file_source.startswith("https://"):
            # Handle URL case
            response = requests.get(file_source)
            response.raise_for_status()
            pdf_content = BytesIO(response.content)
        else:
            # Handle S3 object case
            s3_object = s3_client.get_object(Bucket=s3_bucket_name, Key=file_source)
            pdf_content = BytesIO(s3_object['Body'].read())

        # Use PyPDFLoader with BytesIO object
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(pdf_content.getvalue())
            temp_file_path = temp_file.name

        loader = PyPDFLoader(temp_file_path)
        pages = loader.load()

        # Initialize text splitter
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        return text_splitter.split_documents(pages)

    except Exception as e:
        logging.error(f"Error processing document: {str(e)}")
        raise
    finally:
        if 'temp_file_path' in locals():
            try:
                os.remove(temp_file_path)
            except Exception as e:
                logging.error(f"Error removing temporary file: {str(e)}")

def process_uploaded_document(document_id):
    """
    Process the uploaded document by downloading it from S3 and extracting information.
    """
    logging.info(f"Starting document processing for ID: {document_id}")
    
    try:
        # Retrieve the document object from the database
        document = Document.objects.get(id=document_id)
        s3_key = document.file.name

        # Process the document content directly from S3
        texts = process_document(s3_key)

        # Use HuggingFace embeddings for vector storage
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        # Create Chroma vector store in memory
        vector_store = Chroma.from_documents(
            texts,
            embeddings,
            collection_name=f"document_{document_id}_{uuid.uuid4().hex}"
        )

        # Serialize the vector store to bytes
        vector_store_bytes = pickle.dumps(vector_store)

        # Upload the serialized vector store to S3
        s3_key = f"chroma/{document_id}_vector_store.pkl"
        s3_client.put_object(Body=vector_store_bytes, Bucket=s3_bucket_name, Key=s3_key)

        logging.info("ChromaDB vector store uploaded to S3.")

        # Record the processed document in the database
        ProcessedDocument.objects.create(document=document, collection_name=s3_key)

        # Update the document status
        document.processed = True
        document.save()

        logging.info(f"Document processing completed successfully for ID: {document_id}")
        return True
    except ObjectDoesNotExist:
        logging.error(f"Document with ID {document_id} does not exist.")
        return False
    except Exception as e:
        logging.error(f"Error processing document {document_id}: {str(e)}")
        return False

def answer_question(question, document_ids):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    vector_stores = []

    for doc_id in document_ids:
        try:
            processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
            s3_key = processed_doc.collection_name

            # Download the vector store from S3
            response = s3_client.get_object(Bucket=s3_bucket_name, Key=s3_key)
            vector_store_bytes = response['Body'].read()
            
            # Deserialize the vector store
            vector_store = pickle.loads(vector_store_bytes)
            vector_stores.append(vector_store)

        except ProcessedDocument.DoesNotExist:
            logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
        except ClientError as e:
            logging.error(f"Error retrieving vector store from S3 for document {doc_id}: {str(e)}")
        except Exception as e:
            logging.error(f"Error retrieving vector store for document {doc_id}: {str(e)}")

    if not vector_stores:
        raise ValueError("No valid processed documents found for the given document IDs.")

    similar_docs = []
    for store in vector_stores:
        similar_docs.extend(store.similarity_search(question, k=2))

    similar_docs.sort(key=lambda x: x.metadata.get('score', 0), reverse=True)
    top_similar_docs = similar_docs[:5]

    combined_vector_store = Chroma.from_documents(
        documents=top_similar_docs,
        embedding=embeddings,
        collection_name=f"combined_temp_{uuid.uuid4().hex}"
    )
    
    qa_chain = setup_qa_chain(combined_vector_store)
    result = qa_chain({"query": question})
    
    return {
        'answer': result['result'],
        'sources': [doc.metadata['source'] for doc in result.get('source_documents', [])]
    }

def setup_qa_chain(vector_store):
    prompt_template = """You are an AI assistant specialized in analyzing ESG (Environmental, Social, and Governance) reports. Your task is to answer questions about these reports accurately and comprehensively. When interpreting questions:

    1. Recognize that "Scope 1&2" and "Scope 1 + Scope 2" refer to the same thing.
    2. Be aware of common abbreviations in ESG reporting, such as SBT for Science-Based Targets.
    3. If a question uses unfamiliar terminology, try to interpret it based on context and your knowledge of ESG reporting.
    4. The answer should be in a structured format, easy to read and informative.
    5. Ensure proper spacing between points or lines or paragraphs, however the answer is best.
    Use the provided context to answer the question as best as you can. If the exact information isn't available, provide the most relevant information you can find.

    Context: {context}
    Question: {question}
    Answer:"""
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    llm = OpenAI(model_name="gpt-4", temperature=0, openai_api_key=openai_api_key)
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(search_kwargs={"k": 8}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )

    return qa

def check_documents_processed(document_ids):
    unprocessed_docs = []
    for doc_id in document_ids:
        document = Document.objects.get(id=doc_id)
        if not document.processed:
            unprocessed_docs.append(document.name)
    
    if unprocessed_docs:
        return False, f"The following documents are not yet processed: {', '.join(unprocessed_docs)}"
    return True, "All documents are processed and ready for querying."