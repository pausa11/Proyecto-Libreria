"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 4.2.19.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import environ
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Configuración de environ
env = environ.Env(DEBUG=(bool, False))

# Buscar el archivo .env en varias ubicaciones posibles
env_locations = [
    os.path.join(BASE_DIR, '.env'),  # Desarrollo local
    '/etc/secrets/.env',             # Render Secret Files
]

# Usar el primer archivo .env que encuentre
for env_file in env_locations:
    if os.path.exists(env_file):
        environ.Env.read_env(env_file)
        break

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    'django_filters',
    'channels',
    'drf_spectacular',
    'rest_framework_simplejwt',
    
    # Local apps
    'apps.libros',
    'apps.compras',
    'apps.usuarios',
    'apps.noticias',
    'apps.busqueda',
    'apps.finanzas',
    'apps.mensajeria',
    'apps.recomendaciones',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'config.urls'

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
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': env.db('DATABASE_URL')
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración de Usuario Personalizado
AUTH_USER_MODEL = 'usuarios.Usuario'

# Configuración de JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# Spectacular API settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'API de Librería',
    'DESCRIPTION': 'API para el sistema de gestión de librería',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    
    # Configuración de enums con estructura más robusta
    'ENUM_NAME_OVERRIDES': {
        'apps.mensajeria.models.Mensaje.estado_mensaje': {
            'enum': {
                'ABIERTO': 'EstadoMensajeAbierto',
                'RESPONDIDO': 'EstadoMensajeRespondido',
                'CERRADO': 'EstadoMensajeCerrado',
            },
            'field': 'estado_mensaje'
        },
        'apps.noticias.models.Noticia.estado_noticia': {
            'enum': {
                'BORRADOR': 'EstadoNoticiaBorrador',
                'PUBLICADO': 'EstadoNoticiaPublicado',
            },
            'field': 'estado_noticia'
        }
    },
    
    # Configuraciones para mejorar el manejo de enums
    'ENUM_ADD_EXPLICIT_BLANK_NULL_CHOICE': False,
    'ENUM_GENERATE_CHOICE_DESCRIPTION': True,
    'POSTPROCESSING_HOOKS': [
        'drf_spectacular.hooks.postprocess_schema_enums',
    ],
    'COMPONENT_SPLIT_REQUEST': False,
    'COMPONENT_NO_READ_ONLY_REQUIRED': True,
    'SCHEMA_COERCE_PATH_PK_SUFFIX': True,
    'SCHEMA_PATH_PREFIX': '/api/',
    
    # Tags para organización
    'TAGS': [
        {'name': 'Foros Personales', 'description': 'Gestión de foros personales de usuarios'},
        {'name': 'Mensajes', 'description': 'Gestión de mensajes y respuestas'},
        {'name': 'Notificaciones', 'description': 'Gestión de notificaciones de mensajes'},
        {'name': 'Noticias', 'description': 'Gestión de noticias y publicaciones'},
        {'name': 'Suscripciones', 'description': 'Gestión de suscripciones a noticias'},
        {'name': 'Compras', 'description': 'Gestión de carritos de compra'},
    ],
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js frontend
]

# Channels settings
ASGI_APPLICATION = 'config.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# Email Configuration for Development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@libreria.com'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 1025
