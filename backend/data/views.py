from django.http import JsonResponse
from .models import User,Document
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder

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
        print(user_email)
        try:
            user = User.objects.get(email=user_email)
            documents = Document.objects.filter(user=user)
            # Construct JSON-serializable data
            data = [{'id': doc.id, 'name': doc.name, 'file_url': doc.file.url, 'upload_date': doc.uploaded_at} for doc in documents]
            # Serialize to JSON using DjangoJSONEncoder to handle FieldFile
            json_data = json.dumps(data, cls=DjangoJSONEncoder)
            return JsonResponse(json_data, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
    elif request.method == 'POST':
        user_email = request.POST.get('user_id')
        print(user_email)
        user = User.objects.get(email=user_email)

        file = request.FILES['file']
        name = file.name

        document = Document.objects.create(user=user, file=file, name=name)

        return JsonResponse({'message': 'Document uploaded successfully', 'document_id': document.id})

    return JsonResponse({'error': 'Method not allowed'}, status=405)