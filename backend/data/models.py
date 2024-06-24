from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)  # You might want to use a more secure way to store passwords

    def __str__(self):
        return self.email


# Create your models here.
