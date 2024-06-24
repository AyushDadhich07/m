from django.shortcuts import render
from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password, check_password

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









