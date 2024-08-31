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
import shutil
from langchain.schema import Document as LangchainDocument
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain import LLMChain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from botocore.exceptions import NoCredentialsError
from botocore.exceptions import ClientError
import threading
from filelock import FileLock

import time
dotenv.load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

s3_client = boto3.client('s3', 
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"), 
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"), 
    region_name=os.getenv("AWS_S3_REGION_NAME")
)

s3_bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")

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

# def process_uploaded_document(document_id):
#     try:
#         print("hello from process")
#         document = Document.objects.get(id=document_id)
#         print("hello from after process")

#         print("hello after fetch doc path")
#         print(document.file.path)
#         file_path = document.file.path
#         print(file_path)
#         print("file path abov")
#         texts = process_document(file_path)
        
#         embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
        
#         collection_name = f"document_{document_id}_{uuid.uuid4().hex}"
#         local_chroma_dir = f"./chroma_db/{collection_name}"
        
#         # Create ChromaDB vector store locally
#         vector_store = Chroma.from_documents(
#             texts, 
#             embeddings, 
#             collection_name=collection_name, 
#             persist_directory=local_chroma_dir
#         )
        
#         # Persist to local directory first
#         vector_store.persist()
        
#         # Upload the local directory to S3
#         for root, dirs, files in os.walk(local_chroma_dir):
#             for file in files:
#                 local_file_path = os.path.join(root, file)
#                 s3_key = os.path.relpath(local_file_path, "./chroma_db")
#                 upload_to_s3(local_file_path, s3_key)
        
#         # Clean up local directory after upload
#         os.system(f"rm -rf {local_chroma_dir}")
        
#         ProcessedDocument.objects.create(document=document, collection_name=collection_name)
        
#         document.processed = True
#         document.save()
        
#         return True

#     except Exception as e:
#         logging.error(f"Error processing document {document_id}: {str(e)}")
#         return False
# import os
# import uuid
# import logging
# from chromadb import Chroma  # Assuming chromadb is the module you're using for vector storage
# from sentence_transformers import SentenceTransformer  # Assuming you're using this for embeddings

# def process_uploaded_document(document_id):

def get_s3_file_url(bucket_name, s3_key, region_name='eu-north-1'):
    """Generate a dynamic URL for the S3 file."""
    return f"https://{bucket_name}.s3.{region_name}.amazonaws.com/{s3_key}"

def retry_operation(operation, max_retries=5, delay=1):
    """Retry an operation with a delay."""
    for attempt in range(max_retries):
        try:
            operation()
            return
        except Exception as e:
            logging.warning(f"Attempt {attempt + 1} failed: {str(e)}")
            time.sleep(delay)
    raise Exception(f"Operation failed after {max_retries} retries.")

def close_file_handle(file_path):
    """Close any open file handles."""
    try:
        os.close(file_path)
    except Exception as e:
        logging.error(f"Error closing file handle: {str(e)}")

def process_uploaded_document(document_id):
    """Process the uploaded document by downloading it from S3 and extracting information."""
    logging.info("Starting document processing for ID: %s", document_id)
    
    try:
        # Retrieve the document object from the database
        document = Document.objects.get(id=document_id)
        s3_key = document.file.name

        # Dynamically create the S3 file URL
        s3_file_url = get_s3_file_url(s3_bucket_name, s3_key)
        logging.info("File URL for document %s: %s", document_id, s3_file_url)

        # Prepare local path for downloading the file
        local_path = f'C:/Users/lenovo/Desktop/m/backend/data/documents/{uuid.uuid4().hex}_{os.path.basename(s3_key)}'
        s3 = boto3.client('s3', region_name='eu-north-1')

        # Download the file from S3 to the local path
        s3.download_file(s3_bucket_name, s3_key, local_path)

        logging.info("File downloaded successfully to %s", local_path)

        # Read the content from the downloaded file
        with open(local_path, 'rb') as file:
            content = file.read()

        logging.info("File content retrieved successfully.")

        # Process the document content
        texts = process_document(local_path)

        # Use HuggingFace embeddings for vector storage
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        # Create a unique collection name and local storage path for ChromaDB
        collection_name = f"document_{document_id}_{uuid.uuid4().hex}"
        local_chroma_dir = f"./chroma_db/{collection_name}"

        # Create ChromaDB vector store locally
        vector_store = Chroma.from_documents(
            texts,
            embeddings,
            collection_name=collection_name,
            persist_directory=local_chroma_dir
        )

        # Persist the vector store to the local directory
        vector_store.persist()
        logging.info("ChromaDB vector store created and persisted locally.")

        # Upload the persisted directory to S3
        for root, dirs, files in os.walk(local_chroma_dir):
            for file in files:
                local_file_path = os.path.join(root, file)
                s3_key = os.path.relpath(local_file_path, "./chroma_db")
                upload_to_s3(local_file_path, s3_key)

        logging.info("ChromaDB data uploaded to S3.")

        # Clean up local directory after upload
        def cleanup():
            try:
                shutil.rmtree(local_chroma_dir)
            except Exception as e:
                logging.error(f"Error removing directory {local_chroma_dir}: {str(e)}")
            try:
                os.remove(local_path)
            except Exception as e:
                logging.error(f"Error removing file {local_path}: {str(e)}")

        retry_operation(cleanup)

        logging.info("Local files cleaned up.")

        # Record the processed document in the database
        ProcessedDocument.objects.create(document=document, collection_name=collection_name)

        # Update the document status
        document.processed = True
        document.save()

        logging.info("Document processing completed successfully for ID: %s", document_id)
        return True
    except NoCredentialsError:
        logging.error("Credentials not available for AWS S3.")
        return False
    except Exception as e:
        logging.error(f"Error processing document {document_id}: {str(e)}")
        return False

# def answer_question(question, document_ids):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    vector_stores = []

    for doc_id in document_ids:
        try:
            processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
            local_chroma_dir = f"./chroma_db/{processed_doc.collection_name}"
            
            os.makedirs(local_chroma_dir, exist_ok=True)

            response = s3_client.list_objects_v2(Bucket=s3_bucket_name)

            if 'Contents' not in response:
                logging.warning(f"No files found in S3 bucket {s3_bucket_name}.")
                continue

            files_to_download = [
                obj['Key'] for obj in response['Contents']
                if processed_doc.collection_name in obj['Key']
            ]

            if not files_to_download:
                logging.warning(f"No files found for collection {processed_doc.collection_name} in S3.")
                continue

            for s3_key in files_to_download:
                local_file_path = os.path.join(local_chroma_dir, os.path.basename(s3_key))
                s3_client.download_file(s3_bucket_name, s3_key, local_file_path)
                logging.info(f"Downloaded {s3_key} to {local_file_path}")

            # Implement retry mechanism for file access
            max_retries = 30
            for attempt in range(max_retries):
                try:
                    vector_store = Chroma(
                        collection_name=processed_doc.collection_name,
                        embedding_function=embeddings,
                        persist_directory=local_chroma_dir
                    )
                    vector_stores.append(vector_store)
                    break  # Exit the retry loop if successful
                except Exception as e:
                    if "used by another process" in str(e) and attempt < max_retries - 1:
                        logging.warning(f"Retrying file access due to issue: {str(e)} (Attempt {attempt + 1}/{max_retries})")
                        time.sleep(10)  # Wait before retrying
                    else:
                        logging.error(f"Failed to access file after {max_retries} attempts: {str(e)}")
                        raise e

        except ProcessedDocument.DoesNotExist:
            logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
        except ClientError as e:
            logging.error(f"Error retrieving files from S3 for document {doc_id}: {str(e)}")
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

vector_store_cache = {}

def answer_question(question, document_ids):
    # Load embeddings model once
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    vector_stores = []

    for doc_id in document_ids:
        try:
            # Retrieve processed document details from your database
            processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
            collection_name = processed_doc.collection_name

            # Check if vector store is already cached
            if collection_name in vector_store_cache:
                vector_store = vector_store_cache[collection_name]
                logging.info(f"Using cached vector store for collection {collection_name}.")
            else:
                local_chroma_dir = f"./chroma_db/{collection_name}"
                os.makedirs(local_chroma_dir, exist_ok=True)

                # Retrieve list of files in S3 bucket
                response = s3_client.list_objects_v2(Bucket=s3_bucket_name)

                if 'Contents' not in response:
                    logging.warning(f"No files found in S3 bucket {s3_bucket_name}.")
                    continue

                # Download files related to the collection from S3
                files_to_download = [
                    obj['Key'] for obj in response['Contents']
                    if collection_name in obj['Key']
                ]

                if not files_to_download:
                    logging.warning(f"No files found for collection {collection_name} in S3.")
                    continue

                for s3_key in files_to_download:
                    local_file_path = os.path.join(local_chroma_dir, os.path.basename(s3_key))
                    s3_client.download_file(s3_bucket_name, s3_key, local_file_path)
                    logging.info(f"Downloaded {s3_key} to {local_file_path}")

                # Load the vector store and cache it
                vector_store = Chroma(
                    collection_name=collection_name,
                    embedding_function=embeddings,
                    persist_directory=local_chroma_dir
                )
                vector_store_cache[collection_name] = vector_store
                logging.info(f"Loaded and cached vector store for collection {collection_name}.")

            vector_stores.append(vector_store)

        except ProcessedDocument.DoesNotExist:
            logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
        except ClientError as e:
            logging.error(f"Error retrieving files from S3 for document {doc_id}: {str(e)}")
        except Exception as e:
            logging.error(f"Error retrieving vector store for document {doc_id}: {str(e)}")

    # Check if any vector stores are loaded
    if not vector_stores:
        raise ValueError("No valid processed documents found for the given document IDs.")

    # Find similar documents across all vector stores
    similar_docs = []
    for store in vector_stores:
        similar_docs.extend(store.similarity_search(question, k=2))

    # Sort and select top similar documents
    similar_docs.sort(key=lambda x: x.metadata.get('score', 0), reverse=True)
    top_similar_docs = similar_docs[:5]

    # Combine top similar documents into a new vector store
    combined_vector_store = Chroma.from_documents(
        documents=top_similar_docs,
        embedding=embeddings,
        collection_name=f"combined_temp_{uuid.uuid4().hex}",
        persist_directory="./chroma_db"
    )

    # Set up QA chain and answer the question
    qa_chain = setup_qa_chain(combined_vector_store)
    result = qa_chain({"query": question})

    # Return the result
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