from django.contrib import admin
from .models import Companies

# Register your models here.
class CompaniesAdmin(admin.ModelAdmin):
    list_display=('name','desc','founding_yr','Type','tags', 'Location','Employees','Followers','Engagement','Revenue','Users','Trademarks','Funding','image')
    search_fields=('name','desc','founding_yr','Type','tags','Location','Employees','Followers','Engagement','Revenue','Users','Trademarks','Funding','image')   

admin.site.register(Companies,CompaniesAdmin)    