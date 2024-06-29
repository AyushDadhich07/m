import os
from celery import shared_task
from .models import Document, ProcessedDocument
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
import dotenv

dotenv.load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

def process_document(file_path):
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return text_splitter.split_documents(pages)

@shared_task
def process_uploaded_document(document_id):
    document = Document.objects.get(id=document_id)
    file_path = document.file.path

    texts = process_document(file_path)
    
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    
    vector_store = FAISS.from_documents(texts, embeddings)
    
    vector_store_path = f"faiss_index_{document_id}"
    vector_store.save_local(vector_store_path)
    
    ProcessedDocument.objects.create(document=document, vector_store_path=vector_store_path)
    
    document.processed = True
    document.save()

def setup_qa_chain(vector_store):
    prompt_template = """You are an AI assistant specialized in analyzing ESG (Environmental, Social, and Governance) reports. Your task is to answer questions about these reports accurately and comprehensively. When interpreting questions:

    1. Recognize that "Scope 1&2" and "Scope 1 + Scope 2" refer to the same thing.
    2. Be aware of common abbreviations in ESG reporting, such as SBT for Science-Based Targets.
    3. If a question uses unfamiliar terminology, try to interpret it based on context and your knowledge of ESG reporting.

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
        chain_type_kwargs={"prompt": PROMPT}
    )

    return qa

def answer_question(question, document_ids):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    
    vector_stores = []
    for doc_id in document_ids:
        processed_doc = ProcessedDocument.objects.get(document_id=doc_id)
        vector_store = FAISS.load_local(processed_doc.vector_store_path, embeddings)
        vector_stores.append(vector_store)
    
    if len(vector_stores) > 1:
        combined_vector_store = vector_stores[0].merge_from(vector_stores[1:])
    else:
        combined_vector_store = vector_stores[0]
    
    qa_chain = setup_qa_chain(combined_vector_store)
    
    result = qa_chain.invoke({"query": question})
    
    return result['result']