from rest_framework import serializers
from .models import Question, Answer,User, UserQuestion
from .models import Feedback

from .models import defined_Question

class PredefinedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = defined_Question
        fields = ['id', 'question']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'name', 'email', 'feedback', 'submitted_at']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

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

    def create(self, validated_data):
        user_email = validated_data.pop('user_email')
        user = User.objects.get(email=user_email)
        question_instance = Question.objects.create(user=user, **validated_data)
        return question_instance    


class UserQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuestion
        fields = ['id', 'question', 'answer', 'created_at']