from django.http import JsonResponse
from .models import User,Document,Question, Answer
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import generics
from .serializers import QuestionSerializer, AnswerSerializer
from rest_framework.permissions import IsAuthenticated
from .ai_processing import process_uploaded_document, answer_question, check_documents_processed
import logging

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        print("HEllo")
        data = json.loads(request.body.decode('utf-8'))
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')

        # Create user
        user = User.objects.create(first_name=first_name, last_name=last_name, email=email, password=password)

        # You might want to perform additional validation or error handling here

        response = JsonResponse({'message': 'User created successfully'})
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        return response

    return JsonResponse({'error': 'Method not allowed'}, status=405)
# Assuming your signup form template is named signup.html
# views.py

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')

        # Check if both email and password are provided
        if not email or not password:
            return JsonResponse({'error': 'Both email and password are required'}, status=400)

        # Check if a user with the given email exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)

        # Check if the provided password matches the user's password
        if password != user.password:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

        # If the credentials are correct, return a success message
        return JsonResponse({'message': 'Login successful'})

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def document_upload(request):
    if request.method == 'GET':
        user_email = request.GET.get('userEmail')
        try:
            user = User.objects.get(email=user_email)
            documents = Document.objects.filter(user=user)
            data = [{'id': doc.id, 'name': doc.name, 'file_url': doc.file.url, 'upload_date': doc.uploaded_at, 'processed': doc.processed} for doc in documents]
            json_data = json.dumps(data, cls=DjangoJSONEncoder)
            return JsonResponse(json_data, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
    elif request.method == 'POST':
        user_email = request.POST.get('user_id')
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        file = request.FILES['file']
        name = file.name

        document = Document.objects.create(user=user, file=file, name=name)
        
        # Process the document synchronously
        try:
            success = process_uploaded_document(document.id)
            if success:
                return JsonResponse({'message': 'Document uploaded and processed successfully', 'document_id': document.id})
            else:
                return JsonResponse({'error': 'Error processing document'}, status=500)
        except Exception as e:
            logging.error(f"Error processing document: {str(e)}")
            return JsonResponse({'error': f'Error processing document: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def answer_question_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            question = data.get('question')
            document_ids = data.get('documentIds')

            if not question or not document_ids:
                return JsonResponse({'error': 'Question and document IDs are required'}, status=400)

            all_processed, message = check_documents_processed(document_ids)
            if not all_processed:
                return JsonResponse({'error': message}, status=400)

            result = answer_question(question, document_ids)
            return JsonResponse({
                'answer': result['answer'],
                'sources': result['sources']
            })
        except Exception as e:
            logging.error(f"Error answering question: {str(e)}")
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
class QuestionListCreate(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

@csrf_exempt
class AnswerListCreate(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id)

    def perform_create(self, serializer):
        question_id = self.kwargs['question_id']
        question = Question.objects.get(id=question_id)
        serializer.save(question=question)







