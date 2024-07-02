from django.contrib import admin
from .models import User, Document, ProcessedDocument, Question, Answer

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('email',)

class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'uploaded_at', 'processed')
    list_filter = ('processed', 'uploaded_at')
    search_fields = ('name', 'user__email')
    date_hierarchy = 'uploaded_at'

class ProcessedDocumentAdmin(admin.ModelAdmin):
    list_display = ('document', 'collection_name')
    search_fields = ('document__name', 'collection_name')

class AnswerInline(admin.StackedInline):
    model = Answer
    extra = 0

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title', 'content', 'user__email')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
    inlines = [AnswerInline]

class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question', 'user', 'created_at')
    search_fields = ('content', 'question__title', 'user__email')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'

admin.site.register(User, UserAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(ProcessedDocument, ProcessedDocumentAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)