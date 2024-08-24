import os
from .models import Document, ProcessedDocument
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
import dotenv
import logging
import uuid
import boto3
from langchain.schema import Document as LangchainDocument
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain import LLMChain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

dotenv.load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

s3_client = boto3.client('s3', 
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"), 
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"), 
    region_name=os.getenv("AWS_S3_REGION_NAME")
)

s3_bucket_name = os.getenv("AWS_S3_BUCKET_NAME")

def upload_to_s3(local_path, s3_key):
    s3_client.upload_file(local_path, s3_bucket_name, s3_key)

def download_from_s3(s3_key, local_path):
    s3_client.download_file(s3_bucket_name, s3_key, local_path)

def process_document(file_path):
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    print("split hogya!!")
    print()
    return text_splitter.split_documents(pages)

def process_uploaded_document(document_id):
    try:
        document = Document.objects.get(id=document_id)
        file_path = document.file.path

        texts = process_document(file_path)
        
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
        
        collection_name = f"document_{document_id}_{uuid.uuid4().hex}"
        local_chroma_dir = f"./chroma_db/{collection_name}"
        
        # Create ChromaDB vector store locally
        vector_store = Chroma.from_documents(
            texts, 
            embeddings, 
            collection_name=collection_name, 
            persist_directory=local_chroma_dir
        )
        
        # Persist to local directory first
        vector_store.persist()
        
        # Upload the local directory to S3
        for root, dirs, files in os.walk(local_chroma_dir):
            for file in files:
                local_file_path = os.path.join(root, file)
                s3_key = os.path.relpath(local_file_path, "./chroma_db")
                upload_to_s3(local_file_path, s3_key)
        
        # Clean up local directory after upload
        os.system(f"rm -rf {local_chroma_dir}")
        
        ProcessedDocument.objects.create(document=document, collection_name=collection_name)
        
        document.processed = True
        document.save()
        
        return True

    except Exception as e:
        logging.error(f"Error processing document {document_id}: {str(e)}")
        return False

def answer_question(question, document_ids):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    
    vector_stores = []

    for doc_id in document_ids:
        try:
            processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
            s3_key = f"chroma_db/{processed_doc.collection_name}/"
            local_chroma_dir = f"./chroma_db/{processed_doc.collection_name}"
            
            # Download from S3 to a local directory
            os.makedirs(local_chroma_dir, exist_ok=True)
            download_from_s3(s3_key, local_chroma_dir)
            
            # Load ChromaDB vector store from local directory
            vector_store = Chroma(
                collection_name=processed_doc.collection_name,
                embedding_function=embeddings,
                persist_directory=local_chroma_dir
            )
            vector_stores.append(vector_store)

        except ProcessedDocument.DoesNotExist:
            logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
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
        collection_name=f"combined_temp_{uuid.uuid4().hex}",
        persist_directory="./chroma_db"
    )
    
    qa_chain = setup_qa_chain(combined_vector_store)
    result = qa_chain({"query": question})
    
    return {
        'answer': result['result'],
        'sources': [doc.metadata['source'] for doc in result.get('source_documents', [])]
    }

def setup_qa_chain(vector_store):
    # llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

    prompt_template = """You are an AI assistant specialized in analyzing ESG (Environmental, Social, and Governance) reports. Your task is to answer questions about these reports accurately and comprehensively. When interpreting questions:

    1. Recognize that "Scope 1&2" and "Scope 1 + Scope 2" refer to the same thing.
    2. Be aware of common abbreviations in ESG reporting, such as SBT for Science-Based Targets.
    3. If a question uses unfamiliar terminology, try to interpret it based on context and your knowledge of ESG reporting.
    4. The answer should be in a structured format, easy to read and infromative.
    5. Ensure proper spacing between points or lines or paragraphs, however the answer is best.
    Use the provided context to answer the question as best as you can. If the exact information isn't available, provide the most relevant information you can find.

    Context: {context}
    Question: {question}
    Answer:"""
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=openai_api_key)
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