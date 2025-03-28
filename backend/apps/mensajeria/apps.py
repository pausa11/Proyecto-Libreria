from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class MensajeriaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mensajeria'
    verbose_name = _('Mensajería')

    def ready(self):
        try:
            import apps.mensajeria.signals
        except ImportError:
            pass
