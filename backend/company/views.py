from django.shortcuts import render
from django.http import JsonResponse
from .models import Companies

def Company(request):
    companies = Companies.objects.all()
    data = list(companies.values())  # Serialize queryset to JSON serializable format
    return JsonResponse(data, safe=False)
     

# Create your views here.
