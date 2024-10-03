import os
import numpy as np
import uuid
import logging
import boto3
import requests
import tempfile
import io
import time
from pathlib import Path
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from botocore.exceptions import NoCredentialsError, ClientError
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from filelock import FileLock
from io import BytesIO
import pickle
from tempfile import NamedTemporaryFile
from .models import Document, ProcessedDocument
import json
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings  
# from vector_lake.langchain import VectorLakeStore

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize AWS S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_S3_REGION_NAME")
)

s3_bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
s3_region = os.getenv("AWS_S3_REGION_NAME")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Helper Functions
def upload_to_s3(local_path, s3_key):
    """Upload a local file to S3."""
    s3_client.upload_file(local_path, s3_bucket_name, s3_key)

def download_from_s3_to_memory(s3_key):
    """Download a file from S3 into memory."""
    s3_object = s3_client.get_object(Bucket=s3_bucket_name, Key=s3_key)
    return BytesIO(s3_object['Body'].read())


#chlra
# def process_uploaded_document(document_id):
#     """Process the uploaded document by downloading it from S3 and extracting information."""
#     logging.info(f"Starting document processing for ID: {document_id}")

#     try:
#         document = Document.objects.get(id=document_id)
#         s3_key = document.file.name
#         file_obj = document.file 
#         # upload_to_s3(s3_file_url,s3_key)
#         s3_client.upload_fileobj(file_obj,s3_bucket_name,s3_key)
#         print("file uploaded")
#         s3_file_url = get_s3_file_url(s3_bucket_name,s3_key, s3_region)
#         logging.info(f"S3 File URL for document {document_id}: {s3_file_url}")

#         texts = process_document(s3_file_url)
#         # Log the type and content of texts
#         logging.info(f"Type of texts: {type(texts)}")

#         # Initialize the list to hold document contents
#         document_texts = []

#         if isinstance(texts, list):
#             for item in texts:
#                 if isinstance(item, dict):
#                     # Assuming each dictionary has a 'page_content' field
#                     document_texts.append(item.get('page_content', ''))
#                 elif isinstance(item, str):
#                     # Directly append string items
#                     document_texts.append(item)
#                 else:
#                     # Convert unexpected formats to string
#                     document_texts.append(str(item))
#                     logging.warning("Converted unexpected format to string.")
#         elif isinstance(texts, str):
#             # Handle single string case
#             document_texts.append(texts)
#             logging.warning("Converted single text string to list.")

#         ids = [str(uuid.uuid4()) for _ in range(len(document_texts))]

#         # print(document_texts)

#         embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

#         # Define collection_name
#         collection_name = f"document_{document_id}_{uuid.uuid4().hex}"

#         # Replace localhost with remote ChromaDB or use Pinecone
#         # client = chromadb.HttpClient(
#         #     host="localhost",  # Replace with actual host
#         #     port=8000,
#         #     ssl=False,
#         #     headers=None,
#         #     settings=Settings(),
#         #     tenant=DEFAULT_TENANT,
#         #     database=DEFAULT_DATABASE,
#         # )

#         logging.info(f"Adding texts to collection:")

#         # collection = client.get_or_create_collection(collection_name)
#         # collection.add(documents=document_texts, ids=ids)

#         logging.info("Texts added")

#         logging.info(f"Creating vector store from documents")

#         # vector_store = Chroma.from_texts(
#         #     texts=document_texts,
#         #     embedding=embeddings,
#         #     ids=ids,
#         #     collection_name=collection_name,
#         # )
#         chromadb.api.client.SharedSystemClient.clear_system_cache()
#         vector_store = Chroma.from_texts(
#             texts=document_texts,
#             embedding=embeddings,
#             ids=ids,
#             collection_name=collection_name
#         )

        


#         logging.info(f"Added documents to vector store")

#         print(vector_store)
#         print(dir(vector_store))  # This will show all available attributes and methods for Chroma object
#         print(dir(vector_store))  # This will show all available attributes and methods for Chroma object

#         # Instead of persisting locally, upload directly to S3
#         vector_data = serialize_vector_store(vector_store)  # Implement serialization logic
#         s3_key = f"chroma/{document_id}_vector_store.json"
#         s3_client.put_object(Body=vector_data, Bucket=s3_bucket_name, Key=s3_key)
#         chroma_url = get_s3_file_url(s3_bucket_name, s3_key, s3_region)

#         logging.info("ChromaDB vector store uploaded to S3.")

#         ProcessedDocument.objects.create(document=document, collection_name=s3_key)
#         document.processed = True
#         document.save()

#         logging.info(f"Document processing completed for ID: {document_id} with URL: {chroma_url}")
#         return True
#     except ObjectDoesNotExist:
#         logging.error(f"Document with ID {document_id} does not exist.")
#         return False
#     except Exception as e:
#         logging.error(f"Error processing document {document_id}: {e}")
#         return False


def process_uploaded_document(document_id):
    """Process the uploaded document by downloading it from S3 and extracting information."""
    logging.info(f"Starting document processing for ID: {document_id}")

    try:
        document = Document.objects.get(id=document_id)
        s3_key = document.file.name
        file_obj = document.file 
        s3_client.upload_fileobj(file_obj, s3_bucket_name, s3_key)
        print("file uploaded")
        s3_file_url = get_s3_file_url(s3_bucket_name, s3_key, s3_region)
        logging.info(f"S3 File URL for document {document_id}: {s3_file_url}")

        texts = process_document(s3_file_url)
        logging.info(f"Type of texts: {type(texts)}")

        document_texts = []
        for item in texts:
            if isinstance(item, dict):
                document_texts.append(item.get('page_content', ''))
            elif isinstance(item, str):
                document_texts.append(item)
            else:
                document_texts.append(str(item))
                logging.warning("Converted unexpected format to string.")

        ids = [str(uuid.uuid4()) for _ in range(len(document_texts))]

        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        logging.info(f"Creating FAISS index from documents")

        faiss_index = FAISS.from_texts(
            texts=document_texts,
            embedding=embeddings,
            metadatas=[{"id": id} for id in ids]
        )

        logging.info(f"Added documents to FAISS index")

        # Serialize FAISS index
        faiss_bytes = faiss_index.serialize_to_bytes()
        
        # Upload serialized FAISS index to S3
        s3_key = f"faiss/{document_id}_faiss_index.pkl"
        s3_client.put_object(Body=faiss_bytes, Bucket=s3_bucket_name, Key=s3_key)
        faiss_url = get_s3_file_url(s3_bucket_name, s3_key, s3_region)

        logging.info("FAISS index uploaded to S3.")

        ProcessedDocument.objects.create(document=document, collection_name=s3_key)
        document.processed = True
        document.save()

        logging.info(f"Document processing completed for ID: {document_id} with URL: {faiss_url}")
        return True
    except Exception as e:
        logging.error(f"Error processing document {document_id}: {e}")
        return False


def get_s3_file_url(bucket_name, s3_key, region_name='eu-north-1'):
    """Generate a URL for the S3 file."""
    return f"https://{bucket_name}.s3.{region_name}.amazonaws.com/{s3_key}"

def retry_operation(operation, max_retries=5, delay=1):
    """Retry an operation with a delay."""
    for attempt in range(max_retries):
        try:
            operation()
            return
        except Exception as e:
            logging.warning(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(delay)
    raise Exception(f"Operation failed after {max_retries} retries.")

def process_uploaded_document(document_id):
    """Process the uploaded document by downloading it from S3 and extracting information."""
    logging.info(f"Starting document processing for ID: {document_id}")

    try:
        document = Document.objects.get(id=document_id)
        s3_key = document.file.name
        file_obj = document.file 
        # upload_to_s3(s3_file_url,s3_key)
        s3_client.upload_fileobj(file_obj,s3_bucket_name,s3_key)
        print("file uploaded")
        s3_file_url = get_s3_file_url(s3_bucket_name,s3_key, s3_region)
        logging.info(f"S3 File URL for document {document_id}: {s3_file_url}")

        texts = process_document(s3_file_url)
        # Log the type and content of texts
        logging.info(f"Type of texts: {type(texts)}")

        # Initialize the list to hold document contents
        document_texts = []

        if isinstance(texts, list):
            for item in texts:
                if isinstance(item, dict):
                    # Assuming each dictionary has a 'page_content' field
                    document_texts.append(item.get('page_content', ''))
                elif isinstance(item, str):
                    # Directly append string items
                    document_texts.append(item)
                else:
                    # Convert unexpected formats to string
                    document_texts.append(str(item))
                    logging.warning("Converted unexpected format to string.")
        elif isinstance(texts, str):
            # Handle single string case
            document_texts.append(texts)
            logging.warning("Converted single text string to list.")

        ids = [str(uuid.uuid4()) for _ in range(len(document_texts))]

        # print(document_texts)

        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        # Define collection_name
        collection_name = f"document_{document_id}_{uuid.uuid4().hex}"

        # Replace localhost with remote ChromaDB or use Pinecone
        # client = chromadb.HttpClient(
        #     host="localhost",  # Replace with actual host
        #     port=8000,
        #     ssl=False,
        #     headers=None,
        #     settings=Settings(),
        #     tenant=DEFAULT_TENANT,
        #     database=DEFAULT_DATABASE,
        # )

        logging.info(f"Adding texts to collection:")

        # collection = client.get_or_create_collection(collection_name)
        # collection.add(documents=document_texts, ids=ids)

        logging.info("Texts added")

        logging.info(f"Creating vector store from documents")

        # vector_store = Chroma.from_texts(
        #     texts=document_texts,
        #     embedding=embeddings,
        #     ids=ids,
        #     collection_name=collection_name,
        # )
        chromadb.api.client.SharedSystemClient.clear_system_cache()
        vector_store = Chroma.from_texts(
            texts=document_texts,
            embedding=embeddings,
            ids=ids,
            collection_name=collection_name
        )

        


        logging.info(f"Added documents to vector store")

        print(vector_store)
        print(dir(vector_store))  # This will show all available attributes and methods for Chroma object
        print(dir(vector_store))  # This will show all available attributes and methods for Chroma object

        # Instead of persisting locally, upload directly to S3
        vector_data = serialize_vector_store(vector_store)  # Implement serialization logic
        s3_key = f"chroma/{document_id}_vector_store.json"
        s3_client.put_object(Body=vector_data, Bucket=s3_bucket_name, Key=s3_key)
        chroma_url = get_s3_file_url(s3_bucket_name, s3_key, s3_region)

        logging.info("ChromaDB vector store uploaded to S3.")

        ProcessedDocument.objects.create(document=document, collection_name=s3_key)
        document.processed = True
        document.save()

        logging.info(f"Document processing completed for ID: {document_id} with URL: {chroma_url}")
        return True
    except ObjectDoesNotExist:
        logging.error(f"Document with ID {document_id} does not exist.")
        return False
    except Exception as e:
        logging.error(f"Error processing document {document_id}: {e}")
        return False






# def serialize_vector_store(vector_store):
#     """
#     Serialize the vector store data to a JSON format for uploading to AWS S3.
#     """
#     # Convert the vector store to a Python dictionary
#     vector_data_dict = {
#         "collection_name": vector_store._collection.name,
#         "documents": vector_store._collection.get(),
#         "embeddings": vector_store._collection.get(include=['embeddings'])['embeddings'],
#     }
    
#     # Serialize dictionary to JSON string
#     json_data = json.dumps(vector_data_dict, indent=2)  # Converts to JSON format with indentation for readability

#     # Convert JSON string to a binary format compatible with S3
#     json_bytes = BytesIO(json_data.encode('utf-8'))  # Convert to bytes for S3 upload

#     return json_bytes

def serialize_vector_store(vector_store):
    """
    Serialize the vector store data to a JSON format for uploading to AWS S3.
    """
    # Get all data from the collection
    collection_data = vector_store._collection.get(include=['embeddings', 'documents', 'metadatas'])
    
    # Convert the vector store to a Python dictionary
    vector_data_dict = {
        "collection_name": vector_store._collection.name,
        "documents": collection_data['documents'],
        "metadatas": collection_data['metadatas'],
        "embeddings": [emb.tolist() if isinstance(emb, np.ndarray) else emb for emb in collection_data['embeddings']],
    }
    
    # Custom JSON encoder to handle numpy types
    class NumpyEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            return super(NumpyEncoder, self).default(obj)
    
    # Serialize dictionary to JSON string
    json_data = json.dumps(vector_data_dict, indent=2, cls=NumpyEncoder)
    
    # Convert JSON string to a binary format compatible with S3
    json_bytes = BytesIO(json_data.encode('utf-8'))

    return json_bytes


def setup_qa_chain(vector_store):
    """Set up the QA chain for answering questions."""
    prompt_template = """
    You are an AI assistant specialized in analyzing ESG (Environmental, Social, and Governance) reports. Your task is to answer questions about these reports accurately and comprehensively. When interpreting questions:
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

    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=openai_api_key)
    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(search_kwargs={"k": 8}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )

vector_store_cache = {}

# def answer_question(question, document_ids):
#     """Answer a question based on processed documents."""
#     embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
#     vector_stores = []

#     for doc_id in document_ids:
#         try:
#             # Fetch the processed document entry from the database
#             processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
#             s3_key = processed_doc.collection_name

#             # Construct S3 URL
#             s3_url = f"https://maxiumsys.s3.eu-north-1.amazonaws.com/{s3_key}"

#             # Check if vector store is already cached
#             if s3_key in vector_store_cache:
#                 vector_store = vector_store_cache[s3_key]
#                 logging.info(f"Using cached vector store for collection {s3_key}.")
#             else:
#                 # Download vector store file directly from S3 URL
#                 response = requests.get(s3_url)
#                 if response.status_code == 200:
#                     file_content = response.content
#                     logging.info(f"Downloaded {s3_key} with size {len(file_content)} bytes.")

#                     if not file_content:
#                         raise ValueError(f"Downloaded file content for {s3_key} is empty.")

#                     # Use BytesIO to handle the file in-memory
#                     with io.BytesIO(file_content) as file_buffer:
#                         try:
#                             # Load the vector store from the in-memory file object
#                             vector_store_data = pickle.load(file_buffer)
                            
#                             # Initialize vector store (adjust this as needed)
#                             vector_store = Chroma(
#                                 collection_name=s3_key,
#                                 embedding_function=embeddings,
#                                 persist_directory=None  # Use None or appropriate value as you're loading from memory
#                             )
#                             vector_store.load_data(vector_store_data)  # Assuming Chroma has a method to load data directly
#                             vector_store_cache[s3_key] = vector_store
#                             logging.info(f"Loaded and cached vector store for collection {s3_key}.")
#                         except pickle.UnpicklingError as e:
#                             logging.error(f"Error unpickling vector store data for {s3_key}: {e}")
#                         except Exception as e:
#                             logging.error(f"Error loading vector store from in-memory file for {s3_key}: {e}")
#                 else:
#                     logging.warning(f"Failed to download vector store file from {s3_url}. Status code: {response.status_code}")

#             vector_stores.append(vector_store)
#         except ProcessedDocument.DoesNotExist:
#             logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
#         except ClientError as e:
#             logging.error(f"Error retrieving files from S3 for document {doc_id}: {e}")
#         except Exception as e:
#             logging.error(f"Error retrieving vector store for document {doc_id}: {e}")

#     if not vector_stores:
#         raise ValueError("No valid processed documents found for the given document IDs.")

#     similar_docs = []
#     for store in vector_stores:
#         try:
#             search_results = store.similarity_search(question)
#             if not search_results:
#                 logging.warning("No similar documents found in the vector store.")
#             similar_docs.extend(search_results)
#         except Exception as e:
#             logging.error(f"Error during similarity search: {e}")

#     if not similar_docs:
#         raise ValueError("No similar documents found.")

#     # Set up the QA chain using the first vector store
#     qa_chain = setup_qa_chain(vector_stores[0])
#     response = qa_chain({"query": question})
#     logging.info(f"Question answered: {response['result']}")
#     return response['result']


# def answer_question(question, document_ids):
#     """Answer a question based on processed documents."""
#     embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
#     vector_stores = []

#     for doc_id in document_ids:
#         vector_store=None
#         try:
#             # Fetch the processed document entry from the database
#             processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
#             s3_key = processed_doc.collection_name

#             # Construct S3 URL
#             s3_url = f"https://maxiumsys.s3.eu-north-1.amazonaws.com/{s3_key}"

#             # Check if vector store is already cached
#             if s3_key in vector_store_cache:
#                 vector_store = vector_store_cache[s3_key]
#                 logging.info(f"Using cached vector store for collection {s3_key}.")
#             else:
#                 # Download vector store file directly from S3 URL
#                 response = requests.get(s3_url)
#                 if response.status_code == 200:
#                     file_content = response.content
#                     logging.info(f"Downloaded {s3_key} with size {len(file_content)} bytes.")

#                     if not file_content:
#                         raise ValueError(f"Downloaded file content for {s3_key} is empty.")

#                     try:
#                         # Parse the JSON data
#                         vector_store_data = json.loads(file_content)
#                         logging.info(f"JSON structure: {json.dumps(vector_store_data, indent=2)[:1000]}...") 
#                         # Extract necessary data
#                         collection_name = vector_store_data['collection_name']
#                         documents = vector_store_data['documents']
#                         document_embeddings = vector_store_data['embeddings']

#                         # Initialize vector store
#                         vector_store = Chroma.from_texts(
#                             texts=[doc['text'] for doc in documents],
#                             embedding=document_embeddings,
#                             ids=[doc['id'] for doc in documents],
#                             collection_name=collection_name
#                         )
#                         print("YOOOOOO")
#                         # Manually set the embeddings
#                         vector_store._collection.upsert(
#                             ids=[doc['id'] for doc in documents],
#                             embeddings=document_embeddings,
#                             documents=[doc['text'] for doc in documents]
#                         )
                        
#                         vector_store_cache[s3_key] = vector_store
#                         logging.info(f"Loaded and cached vector store for collection {s3_key}.")
#                     except json.JSONDecodeError as e:
#                         logging.error(f"Error parsing JSON data for {s3_key}: {e}")
#                     except Exception as e:
#                         logging.error(f"Error loading vector store from JSON for {s3_key}: {e}")
#                 else:
#                     logging.warning(f"Failed to download vector store file from {s3_url}. Status code: {response.status_code}")

#             vector_stores.append(vector_store)
#         except ProcessedDocument.DoesNotExist:
#             logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
#         except ClientError as e:
#             logging.error(f"Error retrieving files from S3 for document {doc_id}: {e}")
#         except Exception as e:
#             logging.error(f"Error retrieving vector store for document {doc_id}: {e}")

#     if not vector_stores:
#         raise ValueError("No valid processed documents found for the given document IDs.")

#     similar_docs = []
#     for store in vector_stores:
#         try:
#             search_results = store.similarity_search(question)
#             if not search_results:
#                 logging.warning("No similar documents found in the vector store.")
#             similar_docs.extend(search_results)
#         except Exception as e:
#             logging.error(f"Error during similarity search: {e}")

#     if not similar_docs:
#         raise ValueError("No similar documents found.")

#     # Set up the QA chain using the first vector store
#     qa_chain = setup_qa_chain(vector_stores[0])
#     response = qa_chain({"query": question})
#     logging.info(f"Question answered: {response['result']}")
#     return response['result']


def answer_question(question, document_ids):
    """Answer a question based on processed documents."""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    faiss_indexes = []

    for doc_id in document_ids:
        faiss_index = None
        try:
            processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
            s3_key = processed_doc.collection_name
            s3_url = f"https://maxiumsys.s3.eu-north-1.amazonaws.com/{s3_key}"

            if s3_key in vector_store_cache:
                faiss_index = vector_store_cache[s3_key]
                logging.info(f"Using cached FAISS index for collection {s3_key}.")
            else:
                response = requests.get(s3_url)
                if response.status_code == 200:
                    file_content = response.content
                    logging.info(f"Downloaded {s3_key} with size {len(file_content)} bytes.")

                    if not file_content:
                        raise ValueError(f"Downloaded file content for {s3_key} is empty.")

                    try:
                        faiss_index = FAISS.deserialize_from_bytes(file_content, embeddings)
                        vector_store_cache[s3_key] = faiss_index
                        logging.info(f"Loaded and cached FAISS index for collection {s3_key}.")
                    except Exception as e:
                        logging.error(f"Error loading FAISS index for {s3_key}: {e}")
                        logging.exception("Stack trace:")
                else:
                    logging.warning(f"Failed to download FAISS index from {s3_url}. Status code: {response.status_code}")

            if faiss_index is not None:
                faiss_indexes.append(faiss_index)
            else:
                logging.warning(f"FAISS index for document {doc_id} was not created or loaded.")

        except ProcessedDocument.DoesNotExist:
            logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
        except ClientError as e:
            logging.error(f"Error retrieving files from S3 for document {doc_id}: {e}")
        except Exception as e:
            logging.error(f"Error retrieving FAISS index for document {doc_id}: {e}")
            logging.exception("Stack trace:")

    if not faiss_indexes:
        raise ValueError("No valid processed documents found for the given document IDs.")

    similar_docs = []
    for index in faiss_indexes:
        if index is not None:
            try:
                search_results = index.similarity_search(question)
                if not search_results:
                    logging.warning("No similar documents found in the FAISS index.")
                similar_docs.extend(search_results)
            except Exception as e:
                logging.error(f"Error during similarity search: {e}")
                logging.exception("Stack trace:")
        else:
            logging.warning("Skipping similarity search for None FAISS index.")

    if not similar_docs:
        raise ValueError("No similar documents found.")

    # Set up the QA chain using the first non-None FAISS index
    qa_chain = setup_qa_chain(next(index for index in faiss_indexes if index is not None))
    response = qa_chain({"query": question})
    logging.info(f"Question answered: {response['result']}")
    return response['result'], similar_docs


#chlra hai neeche wala but slow

# def answer_question(question, document_ids):
#     """Answer a question based on processed documents."""
#     embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
#     vector_stores = []

#     for doc_id in document_ids:
#         vector_store = None
#         try:
#             processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
#             s3_key = processed_doc.collection_name
#             s3_url = f"https://maxiumsys.s3.eu-north-1.amazonaws.com/{s3_key}"

#             if s3_key in vector_store_cache:
#                 vector_store = vector_store_cache[s3_key]
#                 logging.info(f"Using cached vector store for collection {s3_key}.")
#             else:
#                 response = requests.get(s3_url)
#                 if response.status_code == 200:
#                     file_content = response.content
#                     logging.info(f"Downloaded {s3_key} with size {len(file_content)} bytes.")

#                     if not file_content:
#                         raise ValueError(f"Downloaded file content for {s3_key} is empty.")

#                     try:
#                         vector_store_data = json.loads(file_content)
#                         logging.info(f"JSON structure keys: {vector_store_data.keys()}")
                        
#                         collection_name = vector_store_data.get('collection_name', s3_key)
#                         documents = vector_store_data.get('documents', [])
#                         document_embeddings = vector_store_data.get('embeddings', [])

#                         logging.info(f"Documents type: {type(documents)}")
#                         if isinstance(documents, list):
#                             logging.info(f"First document structure: {documents[0] if documents else 'No documents'}")
#                         elif isinstance(documents, dict):
#                             logging.info(f"Documents keys: {documents.keys()}")

#                         # Handle different possible structures
#                         texts = []
#                         ids = []
#                         if isinstance(documents, list):
#                             for doc in documents:
#                                 if isinstance(doc, dict):
#                                     texts.append(doc.get('text', doc.get('page_content', '')))
#                                     ids.append(doc.get('id', str(uuid.uuid4())))
#                                 elif isinstance(doc, str):
#                                     texts.append(doc)
#                                     ids.append(str(uuid.uuid4()))
#                         elif isinstance(documents, dict):
#                             texts = documents.get('texts', []) or documents.get('documents', [])
#                             ids = documents.get('ids', []) or [str(uuid.uuid4()) for _ in texts]

#                         if not texts:
#                             raise ValueError(f"No valid documents found in the data for {s3_key}")

#                         vector_store = Chroma.from_texts(
#                             texts=texts,
#                             embedding=embeddings,
#                             ids=ids,
#                             collection_name=collection_name
#                         )

#                         if document_embeddings:
#                             vector_store._collection.upsert(
#                                 ids=ids,
#                                 embeddings=document_embeddings,
#                                 documents=texts
#                             )
                        
#                         vector_store_cache[s3_key] = vector_store
#                         logging.info(f"Loaded and cached vector store for collection {s3_key}.")
#                     except json.JSONDecodeError as e:
#                         logging.error(f"Error parsing JSON data for {s3_key}: {e}")
#                     except Exception as e:
#                         logging.error(f"Error loading vector store from JSON for {s3_key}: {e}")
#                         logging.exception("Stack trace:")
#                 else:
#                     logging.warning(f"Failed to download vector store file from {s3_url}. Status code: {response.status_code}")

#             if vector_store is not None:
#                 vector_stores.append(vector_store)
#             else:
#                 logging.warning(f"Vector store for document {doc_id} was not created or loaded.")

#         except ProcessedDocument.DoesNotExist:
#             logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
#         except ClientError as e:
#             logging.error(f"Error retrieving files from S3 for document {doc_id}: {e}")
#         except Exception as e:
#             logging.error(f"Error retrieving vector store for document {doc_id}: {e}")
#             logging.exception("Stack trace:")

#     if not vector_stores:
#         raise ValueError("No valid processed documents found for the given document IDs.")

#     similar_docs = []
#     for store in vector_stores:
#         if store is not None:
#             try:
#                 search_results = store.similarity_search(question)
#                 if not search_results:
#                     logging.warning("No similar documents found in the vector store.")
#                 similar_docs.extend(search_results)
#             except Exception as e:
#                 logging.error(f"Error during similarity search: {e}")
#                 logging.exception("Stack trace:")
#         else:
#             logging.warning("Skipping similarity search for None vector store.")

#     if not similar_docs:
#         raise ValueError("No similar documents found.")

#     # Set up the QA chain using the first non-None vector store
#     qa_chain = setup_qa_chain(next(store for store in vector_stores if store is not None))
#     response = qa_chain({"query": question})
#     logging.info(f"Question answered: {response['result']}")
#     return response['result'],similar_docs


def check_documents_processed(document_ids):
    unprocessed_docs = []
    for doc_id in document_ids:
        document = Document.objects.get(id=doc_id)
        if not document.processed:
            unprocessed_docs.append(document.name)
    
    if unprocessed_docs:
        return False, f"The following documents are not yet processed: {', '.join(unprocessed_docs)}"
    return True, "All documents are processed and ready for querying."
