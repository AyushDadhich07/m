from django.urls import path,include
from . import views
from .views import GoogleLogin


urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('documents/',views.document_upload,name="document_upload"),
    path('questions/', views.question_list_create, name='question-list-create'),
    path('questions/<int:question_id>/answers/', views.answer_list_create, name='answer-list-create'),
    path('answer-question/', views.answer_question_view, name='answer_question'),
    path('user/', views.profile_api, name='profile_api'),
    path('submit-feedback/', views.submit_feedback, name='submit-feedback'),
    path('accounts/', include('allauth.urls')),
    path('documents/<int:document_id>/', views.delete_document, name='delete_document'),
    path('articles/', views.articles_view, name='articles'),
    # path('auth/google/', views.google_login, {'backend': 'google'}, name='google-auth'),
    path('auth/google/redirect/', views.google_redirect, name='google-redirect'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('predefinedQuestion/', views.question_list, name='question-list'),
    path('articles/<int:article_id>/', views.articles_view, name='article-detail'),
    path('user-questions/', views.user_questions, name='user_questions'),
]
