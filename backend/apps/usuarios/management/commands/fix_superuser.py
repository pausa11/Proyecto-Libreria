from django.core.management.base import BaseCommand
from apps.usuarios.models import Usuario

class Command(BaseCommand):
    help = 'Fix superuser permissions and roles'
    
    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the superuser to fix')
    
    def handle(self, *args, **options):
        username = options['username']
        
        try:
            user = Usuario.objects.get(username=username)
            
            # Fix superuser permissions
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.rol = 'ROOT'
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully fixed permissions for superuser "{username}"'
                )
            )
            
        except Usuario.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User "{username}" does not exist')
            )
