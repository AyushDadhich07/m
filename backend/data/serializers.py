from rest_framework import serializers
from .models import Document
from django.contrib.auth import get_user_model

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'user', 'name', 'file', 'uploaded_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']
