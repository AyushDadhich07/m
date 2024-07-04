from django.urls import path
from . import views


urlpatterns = [
    path('profile/', views.Company, name='Company'),
]