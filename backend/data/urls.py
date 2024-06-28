from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
     path('login/', views.login, name='login'),
     path('documents/',views.document_upload,name="document_upload"),
]
