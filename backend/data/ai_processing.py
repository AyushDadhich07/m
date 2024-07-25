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
from langchain.schema import Document as LangchainDocument
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain import LLMChain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

dotenv.load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

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

        logging.info(f"Processing document {document_id}: {file_path}")

        texts = process_document(file_path)
        
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
        
        collection_name = f"document_{document_id}_{uuid.uuid4().hex}"
        vector_store = Chroma.from_documents(texts, embeddings, collection_name=collection_name, persist_directory="./chroma_db")
        vector_store.persist()
        
        ProcessedDocument.objects.create(document=document, collection_name=collection_name)
        
        document.processed = True
        document.save()

        logging.info(f"Document {document_id} processed successfully")
        return True
    except Exception as e:
        logging.error(f"Error processing document {document_id}: {str(e)}")
        return False

def answer_question(question, document_ids):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    
    # Initialize a list to store all vector stores
    vector_stores = []

    for doc_id in document_ids:
        try:
            processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
            vector_store = Chroma(
                collection_name=processed_doc.collection_name,
                embedding_function=embeddings,
                persist_directory="./chroma_db"
            )
            vector_stores.append(vector_store)
            logging.info(f"Retrieved vector store for document {doc_id}")
        except ProcessedDocument.DoesNotExist:
            logging.warning(f"ProcessedDocument for document_id {doc_id} does not exist. Skipping.")
        except Exception as e:
            logging.error(f"Error retrieving vector store for document {doc_id}: {str(e)}")

    if not vector_stores:
        raise ValueError("No valid processed documents found for the given document IDs.")

    # Perform similarity search across all vector stores
    similar_docs = []
    print(question)
    for store in vector_stores:
        similar_docs.extend(store.similarity_search(question, k=2))  # Adjust k as needed
    
    # Sort the similar docs by similarity score (assuming the score is stored in the metadata)
    similar_docs.sort(key=lambda x: x.metadata.get('score', 0), reverse=True)

    # Take the top 5 most similar documents
    top_similar_docs = similar_docs[:5]

    combined_vector_store = Chroma.from_documents(
        documents=top_similar_docs,
        embedding=embeddings,
        collection_name=f"combined_temp_{uuid.uuid4().hex}",
        persist_directory="./chroma_db"
    )
    
    # Set up the QA chain
    qa_chain = setup_qa_chain(combined_vector_store)
    
    # Get the answer
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
    4. First provide a brief summary of the context given to you, and then the answer.
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