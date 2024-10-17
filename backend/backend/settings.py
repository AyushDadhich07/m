# """


import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta


load_dotenv()  # This loads the variables from .env file

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-k!6lhx)jf5xr2t7n6^z)^6#v-za_ixm_-@4ggz4-b^1jxd^iw@'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'm-zbr0.onrender.com',
    'localhost',
    'localhost:8000',
    'localhost:3000'
]



# Application definition

INSTALLED_APPS = [
    # 'django.contrib',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'dj_rest_auth',
    'rest_framework.authtoken',
    'rest_framework',
    'corsheaders',
    'data',
    'company',
    'allauth',
    'allauth.account',
    'rest_framework_simplejwt',
    'social_django',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth.registration',
    # Remove 'celery',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
   
]

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bdnribsas0hqq34tbuwk',
        'USER': 'u9cshdcza8ibvtl9',
        'PASSWORD': 'S3CBJJj70cZWAJUMCzZd',
        'HOST': 'bdnribsas0hqq34tbuwk-mysql.services.clever-cloud.com',  # For example, 'localhost' or Clever Cloud's provided host
        'PORT': '3306',  # For example, '3306' for MySQL
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.google.GoogleOAuth2',  # For Google OAuth
    'allauth.account.auth_backends.AuthenticationBackend',
)
LOGIN_URL="login"
LOGIN_REDIRECT_URL = 'document'
LOGOUT_URL="logout"
LOGOUT_REDIRECT_URL="login"


# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'SCOPE': ['profile', 'email'],
#         'AUTH_PARAMS': {'access_type': 'online'},
#         'OAUTH2_CLIENT_ID': '1001957429102-54mr2l4ddgfg56o7mnaf9i4ufdvs9unt.apps.googleusercontent.com',
#         'OAUTH2_CLIENT_SECRET': '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',
#         'OAUTH2_AUTHORIZE_URL': 'https://accounts.google.com/o/oauth2/auth',
#         'OAUTH2_ACCESS_TOKEN_URL': 'https://accounts.google.com/o/oauth2/token',
#     }
# }



# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'SCOPE': [
#             'profile',
#             'email',
#         ],
#         'AUTH_PARAMS': {
#             'access_type': 'online',
#         },
#         'APP': {
#             'client_id': '407596730605-tkapgflq4sue875k83d8vqakr33fnoul.apps.googleusercontent.com',
#             'secret': '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',
#             'key': 'AIzaSyBvHQE1E8N8KG9RJg8Z4gZG5RLUMM63MN4',
#         }
#     }
# }



REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '552806649066-4c54ijkubdbci729l5lmuc8ej6d0clsq.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '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'

GOOGLE_OAUTH2_CLIENT_ID = "552806649066-4c54ijkubdbci729l5lmuc8ej6d0clsq.apps.googleusercontent.com"
GOOGLE_OAUTH2_CLIENT_SECRET = "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"

LOGIN_REDIRECT_URL = '/auth/google/redirect'

ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True


TOKEN_MODEL = None

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'eu-north-1')
AWS_S3_SIGNATURE_NAME='s3v4'
AWS_S3_FILE_OVERWRITE=False
AWS_S3_VERITY=True
AWS_DEFAULT_ACL=None
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com/'
AWS_S3_ADDRESSING_STYLE = "virtual"

# CORS settings
CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'User-Email', 'X-Requested-With', 'Accept', 'Origin']
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'https://66bbdad89028aeb9a1537260--voluble-hummingbird-f7c333.netlify.app',
    'https://maxiumsys.com'
]

# File upload settings
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]
FILE_UPLOAD_MAX_MEMORY_SIZE = 50485760   # 5 MB

# OpenAI API Key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Hugging Face model setting
HUGGINGFACE_MODEL_NAME = "sentence-transformers/all-mpnet-base-v2"

# FAISS index storage setting
FAISS_INDEX_DIR = BASE_DIR / 'faiss_indexes'

# REST framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}



# ChromaDB settings
CHROMA_DB_DIR = os.path.join(BASE_DIR, 'chroma_db')

SITE_ID = 1

CSRF_TRUSTED_ORIGINS = [
    'https://m-zbr0.onrender.com',
    'https://localhost:3000',
]
# Google OAuth2 credentials
