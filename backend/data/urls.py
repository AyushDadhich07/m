from django.urls import path
from . import views


urlpatterns = [
    path('signup/', views.signup, name='signup'),
     path('login/', views.login, name='login'),
     path('documents/',views.document_upload,name="document_upload"),
     path('questions/', views.question_list_create, name='question-list-create'),
    path('questions/<int:question_id>/answers/', views.answer_list_create, name='answer-list-create'),
    path('answer-question/', views.answer_question_view, name='answer_question'),
]
