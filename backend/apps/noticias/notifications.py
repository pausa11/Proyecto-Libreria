from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Suscripcion

def enviar_notificacion_nueva_noticia(noticia):
    """
    Envía notificaciones por email a los usuarios suscritos
    cuando se publica una nueva noticia
    """
    # Solo enviar si la noticia está publicada
    if noticia.estado_noticia != 'PUBLICADO':  # Cambiado de estado!='publicado'
        return

    # Obtener suscriptores relevantes
    suscripciones = Suscripcion.objects.filter(activo=True)
    if noticia.libro_relacionado and noticia.libro_relacionado.categoria:
        suscripciones = suscripciones.filter(
            categorias_interes=noticia.libro_relacionado.categoria
        )

    for suscripcion in suscripciones:
        # Preparar el contenido del email
        context = {
            'usuario': suscripcion.usuario,
            'noticia': noticia,
        }
        
        # Renderizar el email en HTML
        html_message = render_to_string('noticias/email/nueva_noticia.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            # Enviar el email
            send_mail(
                subject=f'Nueva noticia: {noticia.titulo}',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[suscripcion.usuario.email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error al enviar email a {suscripcion.usuario.email}: {str(e)}")

def enviar_confirmacion_suscripcion(suscripcion):
    """
    Envía un email de confirmación cuando un usuario se suscribe
    """
    context = {
        'usuario': suscripcion.usuario,
        'categorias': suscripcion.categorias_interes.all(),
    }
    
    html_message = render_to_string('noticias/email/confirmacion_suscripcion.html', context)
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject='Confirmación de suscripción a noticias',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[suscripcion.usuario.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error al enviar confirmación a {suscripcion.usuario.email}: {str(e)}")