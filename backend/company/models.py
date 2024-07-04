from django.db import models

# Create your models here.
class Companies(models.Model):
   name=models.CharField(max_length=100)
   desc=models.TextField()
   founding_yr=models.IntegerField()
   Type=models.CharField(max_length=100)
   tags=models.CharField(max_length=100)
   Location=models.CharField(max_length=100)
   Employees=models.CharField(max_length=100)
   Followers=models.CharField(max_length=100)
   Engagement=models.CharField(max_length=100)
   Revenue=models.CharField(max_length=100)
   Users=models.CharField(max_length=100)
   Trademarks=models.IntegerField()
   Funding=models.IntegerField()
   image = models.ImageField(upload_to='company_images/', null=True, blank=True)

   def __str__(self):
        return self.name 