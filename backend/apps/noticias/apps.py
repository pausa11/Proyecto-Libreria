from django.apps import AppConfig

class NoticiasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.noticias'
    verbose_name = 'Gestión de Noticias'

    def ready(self):
        import apps.noticias.signals  # Importamos las señales al iniciar la app
