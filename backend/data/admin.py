from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Document)
admin.site.register(models.Question)
admin.site.register(models.Answer)
