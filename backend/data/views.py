from django.http import JsonResponse
from .models import User, Document, Question, Answer, Feedback,Article,defined_Question,GoogleUser,UserQuestion
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import generics
from .serializers import QuestionSerializer, AnswerSerializer, FeedbackSerializer,PredefinedQuestionSerializer,UserQuestionSerializer
from rest_framework.permissions import IsAuthenticated
from .ai_processing2 import process_uploaded_document, answer_question, check_documents_processed
import logging
from rest_framework.parsers import JSONParser
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from social_django.utils import load_strategy, load_backend
from social_core.exceptions import AuthException
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.shortcuts import redirect
from social_django.utils import psa
import jwt
from social_core.exceptions import AuthForbidden
from rest_framework_simplejwt.tokens import RefreshToken
from social_core.backends.oauth import BaseOAuth2
import requests
import secrets

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

logging.basicConfig(level=logging.INFO)

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        print("HEllo from signup")
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

def google_redirect(request):
    # Get the authorization code from the URL parameters
    code = request.GET.get('code')
    state = request.GET.get('state')
    
    if not code:
        return JsonResponse({'error': 'Authorization code not found'}, status=400)

    # Exchange the authorization code for access token
    token_url = 'https://oauth2.googleapis.com/token'
    token_payload = {
        'code': code,
        'client_id': '552806649066-4c54ijkubdbci729l5lmuc8ej6d0clsq.apps.googleusercontent.com',
        'client_secret': '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',  # Replace with your client secret
        'redirect_uri': 'https://m-zbr0.onrender.com/api/auth/google/redirect',
        'grant_type': 'authorization_code'
    }

    # Get access token
    token_response = requests.post(token_url, data=token_payload)
    if token_response.status_code != 200:
        return JsonResponse({'error': 'Failed to get access token'}, status=400)

    access_token = token_response.json().get('access_token')

    # Get user info from Google
    userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
    headers = {'Authorization': f'Bearer {access_token}'}
    userinfo_response = requests.get(userinfo_url, headers=headers)

    if userinfo_response.status_code != 200:
        return JsonResponse({'error': 'Failed to get user info'}, status=400)

    user_data = userinfo_response.json()

    # Extract user information
    email = user_data.get('email')
    first_name = user_data.get('given_name', '')
    last_name = user_data.get('family_name', '')

    try:
        # Check if user exists
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Create new user if doesn't exist
        import secrets
        random_password = secrets.token_urlsafe(32)  # Generate a secure random password
        user = User.objects.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=random_password  # In a real application, hash this password
        )

    # Log the user in
    request.session['user_id'] = user.id
    
    # Redirect to frontend with success status
    frontend_url = 'https://maxiumsys.com'  # Replace with your frontend URL
    return redirect(f'{frontend_url}/login-success?token={access_token}&email={email}')



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
        print("hi from get")
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
        logging.info("HI")
        user_email = request.POST.get('user_id')
        print (user_email)
        try:
            user = User.objects.get(email=user_email)
            print("User found")
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        print("HEllo from upload file post")
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        file = request.FILES['file']
        name = file.name

        
        # Process the document synchronously
        try:
            document = Document.objects.create(user=user, file=file, name=name)
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
def delete_document(request, document_id):
    if request.method == 'DELETE':
        try:
            document = Document.objects.get(id=document_id)
            document.delete()
            return JsonResponse({'message': 'Document deleted successfully'}, status=200)
        except Document.DoesNotExist:
            return JsonResponse({'error': 'Document not found'}, status=404)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def answer_question_view(request):
    print("Hello")
    if request.method == 'POST':
        try:
            print("Question time")
            data = json.loads(request.body)
            question = data.get('question')
            document_ids = data.get('documentIds')
            user_email=data.get('userEmail')

            if not question or not document_ids:
                return JsonResponse({'error': 'Question and document IDs are required'}, status=400)
            
            print ("Got Question")

            all_processed, message = check_documents_processed(document_ids)
            if not all_processed:
                return JsonResponse({'error': message}, status=400)
            
            print("hi from post")
            user = User.objects.get(email=user_email)
            result,similer_docss = answer_question(question, document_ids)
            # Save the question and answer
            logging.info("hehehe")
            UserQuestion.objects.create(
                user=user,
                question=question,
                answer=result
            )
            logging.info("hehehe2")
            # print(result)
            return JsonResponse({
                'answer': result,
                # 'sources': similer_docss
            })
        except Exception as e:
            logging.error(f"Error answering question: {str(e)}")
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def question_list_create(request):
    if request.method == 'GET':
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = QuestionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user_email=data['user_email'])  # Pass user_email from request data
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def answer_list_create(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        answers = Answer.objects.filter(question_id=question_id)
        serializer = AnswerSerializer(answers, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        user_email = data.pop('user_email', None)
        if not user_email:
            return JsonResponse({'error': 'User email is required'}, status=400)
        
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        serializer = AnswerSerializer(data=data)
        if serializer.is_valid():
            serializer.save(question=question, user=user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def profile_api(request):
    if request.method == 'GET':
        user_email = request.GET.get('user_email', '')
        try:
            profile = User.objects.get(email=user_email)  # Adjust this query based on your model structure
            data = {
                'first_name': profile.first_name,
                'last_name': profile.last_name,
                'email': profile.email,
                # Add other fields you want to expose to the frontend
            }
            return JsonResponse(data)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Profile not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def submit_feedback(request):
    if request.method == 'POST':
         data = json.loads(request.body.decode('utf-8'))
         name=data.get('name')
         email=data.get('email')
         feedback=data.get('feedback')
         entry=Feedback.objects.create(name=name,email=email,feedback=feedback)
         response = JsonResponse({'message': 'Feedback submitted successfully'})
         return response
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def articles_view(request, article_id=None):
    if request.method == 'GET':
        if article_id:
            # Fetch a single article
            article = get_object_or_404(Article, id=article_id)
            article_data = {
                'id': article.id,
                'title': article.title,
                'description': article.description,
                'image_url': article.image_url,
                'date': article.date,
                # Add any additional fields you want to include
            }
            return JsonResponse(article_data)
        else:
            # Fetch all articles
            articles = Article.objects.all().values('id', 'title', 'description', 'image_url', 'date')
            articles_list = list(articles)
            return JsonResponse(articles_list, safe=False)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@api_view(['GET'])
@permission_classes([AllowAny])
def question_list(request):
    if request.method == 'GET':
        questions = defined_Question.objects.all()
        serializer = PredefinedQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@csrf_exempt
def user_questions(request):
    if request.method == 'GET':
        user_email = request.GET.get('userEmail')
        if not user_email:
            return JsonResponse({'error': 'User email is required'}, status=400)

        try:
            user = User.objects.get(email=user_email)
            questions = UserQuestion.objects.filter(user=user).order_by('-created_at')
            serializer = UserQuestionSerializer(questions, many=True)
            return JsonResponse(serializer.data, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({'error': 'Method not allowed'}, status=405)  
