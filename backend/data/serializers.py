from rest_framework import serializers
from .models import Question, Answer

class AnswerSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Answer
        fields = ['id', 'user', 'content', 'created_at']

class QuestionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'user', 'title', 'content', 'created_at', 'answers']
