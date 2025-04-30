# Registro de Cambios del Proyecto

## [2025-02-09] Configuración Inicial del Proyecto

### Nueva Estructura

- **feat(estructura):** Configuración inicial del proyecto Django
  - **commit:** Configuración inicial del proyecto Django
    - Creación de la estructura base del proyecto
    - Configuración de apps Django (libros, usuarios, compras, etc.)
    - Configuración de `settings.py` con las apps necesarias

- **feat(libros):** Implementación del módulo de libros
  - **commit:** Implementación del modelo Libro y sus endpoints
    - Creación del modelo Libro con campos básicos
    - Implementación de serializer para el modelo
    - Configuración de viewsets y rutas
    - Registro en el admin de Django

- **feat(auth):** Configuración de autenticación JWT
  - **commit:** Implementación de autenticación JWT
    - Instalación de `djangorestframework-simplejwt`
    - Configuración de endpoints para tokens
    - Actualización de `requirements.txt`

- **fix(urls):** Corrección de configuración de URLs
  - **commit:** Desactivación temporal de módulos no implementados
    - Comentado de URLs de módulos pendientes
    - Reorganización de `urls.py` principal
    - Corrección de imports en `libros/urls.py`


### Estado Actual del Proyecto

- **Módulos Implementados ✅**
  - **Libros**
    - Modelo completo
    - API REST funcional
    - Endpoints documentados
    - Integración con admin
  - **Autenticación**
    - Sistema JWT implementado
    - Endpoints de token
    - Integración con DRF

- **Módulos Pendientes 🚧**
  - Compras
  - Usuarios (personalizado)
  - Noticias
  - Búsqueda
  - Finanzas
  - Mensajería
  - Recomendaciones

### Próximos Pasos

- Implementar módulo de usuarios personalizado
- Desarrollar sistema de compras
- Integrar búsqueda y recomendaciones
- Implementar sistema de mensajería
- Desarrollar módulo de finanzas

## 2 Commit
### Estado Actual del Sistema (2025-02-10 01:40)

### feat(libros): Mejora del modelo de Libros y sistema de categorías

#### Implementación del sistema de categorías y mejora del modelo Libro
- **Creado modelo Categoria** para clasificación de libros
- **Nuevos campos añadidos al modelo Libro:**
  - `categoria` (ForeignKey a Categoria)
  - `editorial`
  - `año_publicacion` (con validadores)
  - `descripcion`
  - `portada` (ImageField)
- **Admin:**
  - Configuración actualizada para mejor visualización
  - Sistema de ordenamiento por fecha de creación

---

### feat(admin): Mejora de la interfaz administrativa

#### Configuración avanzada del panel administrativo
- **Visualización mejorada** para Libros y Categorías
- **Filtros añadidos** por categoría y año de publicación
- **Campos de búsqueda configurados** para título, autor e ISBN
- **Organización de campos** en secciones lógicas:
  - Información Básica
  - Detalles
  - Inventario
  - Metadata
- **Funcionalidad de colapso** para metadatos

---

### feat(datos): Implementación de datos iniciales

#### Configuración de datos de prueba
- **Creado directorio fixtures** para datos iniciales
- **Implementado initial_data.json** con:
  - 3 categorías base (Ficción, No Ficción, Académico)
  - 4 libros de ejemplo con datos completos
- **Estructura configurada** para facilitar pruebas iniciales

---

### Estado Actual del Sistema (2025-02-10 01:40)

#### Base de Datos
- **Motor:** SQLite (db.sqlite3)

#### Modelos implementados:
- **Libro (Mejorado)**
- **Categoria (Nuevo)**

#### Datos de prueba: Implementados vía fixtures

---

### Funcionalidades Implementadas ✅
- Sistema de categorización de libros
- Panel administrativo mejorado
- Gestión de metadatos (fechas de creación/actualización)
- Soporte para imágenes de portada
- Datos de prueba iniciales

### API Endpoints Disponibles
- **GET** `/api/libros/` - Lista de libros
- **GET** `/api/libros/{id}/` - Detalle de libro
- **POST** `/api/libros/` - Crear libro (requiere auth)
- **PUT** `/api/libros/{id}/` - Actualizar libro (requiere auth)
- **DELETE** `/api/libros/{id}/` - Eliminar libro (requiere auth)

---

### Próximos Pasos
- Implementar sistema de búsqueda avanzada
- Añadir gestión de imágenes de portada
- Implementar filtros adicionales en la API
- Desarrollar pruebas unitarias
- Configurar sistema de usuarios y permisos


## [2025-02-11] Implementación del Sistema de Usuarios y Permisos

### feat(usuarios): Mejora del Sistema de Autenticación y Usuarios

- **Implementación de Fixture de Usuarios**
  - Creación de usuarios de prueba con diferentes roles
    - Bibliotecario
    - Lector
  - Configuración de contraseñas hasheadas seguramente
  - Definición de perfiles con información detallada

- **Mejoras en Autenticación**
  - Refinamiento de endpoints de usuarios
  - Implementación de serializers personalizados
  - Configuración de permisos por tipo de usuario
  - **Implementación de Superusuario**
    - Creación de superusuario administrativo
    - Configuración de permisos totales
    - Acceso completo al sistema de administración

- **Configuración de Permisos**
  - Definición de roles: ADMIN, BIBLIOTECARIO, LECTOR
  - Implementación de lógica de permisos en ViewSet
  - Integración con sistema JWT

### Estado Actual del Sistema

- **Módulos Implementados ✅**
  - Libros
  - Autenticación Avanzada
  - Sistema de Usuarios Personalizado
  - Gestión de Permisos

- **Módulos Pendientes 🚧**
  - Compras
  - Noticias
  - Búsqueda
  - Finanzas
  - Mensajería
  - Recomendaciones

### Próximos Pasos
- Desarrollar sistema de compras
- Implementar módulo de búsqueda
- Crear sistema de recomendaciones

## [2025-02-18] Configuración y Despliegue en Render

### feat(deploy): Configuración inicial del despliegue

- **feat(settings):** Configuración de variables de entorno y CORS
  - **commit:** Implementación de django-environ
    - Configuración de variables de entorno con django-environ
    - Actualización de ALLOWED_HOSTS para Render
    - Configuración de CORS para futuros frontends

- **feat(deployment):** Configuración de Render
  - **commit:** Configuración de despliegue en Render
    - Creación de render.yaml
    - Configuración de gunicorn
    - Ajuste de PYTHONPATH y wsgi
    - Implementación de variables de entorno en Render

### Estado Actual del Sistema

- **Funcionalidades Desplegadas ✅**
  - Backend en Render
  - Sistema de variables de entorno
  - Configuración CORS
  - Documentación API (Swagger/ReDoc)

- **Endpoints Disponibles**
  - `/api/schema/swagger-ui/` - Documentación Swagger
  - `/api/schema/redoc/` - Documentación ReDoc
  - `/api/token/` - Obtención de JWT
  - `/api/token/refresh/` - Refrescar JWT

### Próximos Pasos
- Implementar frontend en GitHub Pages
- Configurar CI/CD
- Implementar pruebas automatizadas
- Configurar monitoreo en producción

## [2025-03-07] Implementación del Sistema de Búsqueda

### feat(busqueda): Configuración inicial del módulo de búsqueda

- **commit:** Implementación básica del sistema de búsqueda
  - Creación del modelo SearchQuery para almacenar consultas de búsqueda
  - Implementación de serializer para el modelo SearchQuery
  - Configuración de endpoint básico de búsqueda
  - Integración con la configuración principal de URLs

#### Detalles de la implementación:

- **Modelo de datos:**
  - Implementación de SearchQuery con campos para almacenar la consulta, resultados y fecha
  - Configuración de campo JSONField para almacenar resultados de búsqueda de manera flexible

- **API RESTful:**
  - Nuevo endpoint `/api/search/` para procesamiento de consultas de búsqueda
  - Soporte para parámetros de consulta mediante GET
  - Estructura preparada para expansión con filtros avanzados

- **Serialización:**
  - Creación de SearchQuerySerializer para transformación de datos
  - Exposición de campos relevantes: query, results, created_at

- **Integración:**
  - Conexión con la configuración principal de URLs
  - Estructura preparada para expansión a otros tipos de búsqueda

### feat(busqueda): Mejora del sistema de búsqueda con filtros avanzados

- **commit:** Implementación de búsqueda flexible y filtros avanzados
  - Modificación del endpoint de búsqueda para soportar filtros independientes
  - Implementación de búsqueda por texto opcional
  - Añadido sistema de filtros por categoría, precio y stock

#### Detalles de la implementación:

- **Búsqueda Flexible:**
  - Parámetro de búsqueda por texto (`q`) ahora es opcional
  - Soporte para búsqueda por título, autor e ISBN
  - Validación mejorada para requerir al menos un criterio de búsqueda

- **Filtros Avanzados:**
  - Filtrado por categoría usando búsqueda insensible a mayúsculas
  - Rango de precios con valores mínimos y máximos
  - Filtrado por stock mínimo disponible
  - Todos los filtros son opcionales y pueden combinarse

- **Mejoras en la Documentación:**
  - Actualización de la documentación Swagger con parámetros opcionales
  - Descripciones detalladas de cada parámetro de búsqueda
  - Ejemplos de uso de los diferentes filtros

### Estado Actual del Sistema

- **Módulos Implementados ✅**
  - **Búsqueda (avanzada)**
    - Búsqueda por texto flexible
    - Filtros por categoría, precio y stock
    - Almacenamiento de historial de consultas
    - Documentación completa en Swagger

- **Funcionalidades de Búsqueda Disponibles:**
  - Búsqueda por texto (título, autor, ISBN)
  - Filtrado por categoría
  - Filtrado por rango de precios
  - Filtrado por stock mínimo
  - Combinación de múltiples filtros
  - Historial de búsquedas

- **Módulos Pendientes 🚧**
  - Integración con recomendaciones
  - Compras
  - Noticias
  - Finanzas
  - Mensajería

### Próximos Pasos
- Implementar búsqueda por sinónimos y palabras relacionadas
- Añadir ordenamiento de resultados
- Integrar sistema de sugerencias de búsqueda
- Optimizar rendimiento con índices de búsqueda
- Conectar con sistema de recomendaciones

# Registro de Cambios del Proyecto

## [2025-03-10] Implementación y Mejora de las Aplicaciones de Compras y Finanzas

### feat(compras): Implementación del módulo de compras

#### Implementación del modelo Carrito y sus funcionalidades
- **Creación del modelo Carrito** con campos básicos:
  - `libros` (ManyToManyField a Libro)
  - `fecha` (DateTimeField con auto_now_add)
- **Métodos añadidos al modelo Carrito:**
  - `total` (calcula el total del carrito con o sin descuento)
  - `total_libros` (cuenta el número de libros en el carrito)
  - `agregar_libro` (agrega un libro al carrito)
  - `quitar_libro` (quita un libro del carrito)
  - `nombre_libros` (devuelve una lista de los nombres de los libros en el carrito)
  - `limpiar_carrito` (vacía el carrito)
  - `pagar` (método placeholder para futuras implementaciones)

#### Configuración del admin para Carrito
- **Registro del modelo Carrito en el admin de Django**
- **Acciones personalizadas en el admin:**
  - `vaciar_carrito` (vacía los carritos seleccionados)
  - `agregar_libro` (permite agregar un libro seleccionado a los carritos)

#### Implementación de serializers y views para Carrito
- **Serializer para Carrito**:
  - `CarritoSerializer` con todos los campos y `fecha` como read-only
- **ViewSet para Carrito**:
  - `CarritoViewSet` con permisos `IsAuthenticatedOrReadOnly`
  - Filtros y búsqueda configurados por `fecha`

---

### feat(finanzas): Implementación del módulo de finanzas

#### Implementación de los modelos Tarjeta y Saldo
- **Creación del modelo Tarjeta** con campos básicos:
  - `numero` (CharField)
  - `fecha_expiracion` (DateField)
  - `cvv` (CharField)
  - `titular` (CharField)
- **Métodos añadidos al modelo Tarjeta:**
  - `mostrar_información` (devuelve una cadena con el número y titular de la tarjeta)

- **Creación del modelo Saldo** con campos básicos:
  - `saldo` (DecimalField)
- **Métodos añadidos al modelo Saldo:**
  - `modificar_saldo` (modifica el saldo)
  - `mostrar_saldo` (devuelve el saldo actual)

#### Configuración del admin para Tarjeta y Saldo
- **Registro de los modelos Tarjeta y Saldo en el admin de Django**
- **Configuración del admin para Tarjeta**:
  - `list_display` (muestra número y titular)
  - `search_fields` (permite buscar por número y titular)
  - `ordering` (ordena por número)
- **Configuración del admin para Saldo**:
  - `list_display` (muestra el saldo)

---

### Estado Actual del Proyecto

- **Módulos Implementados ✅**
  - **Compras**
    - Modelo Carrito completo
    - API REST funcional
    - Endpoints documentados
    - Integración con admin
  - **Finanzas**
    - Modelos Tarjeta y Saldo completos
    - Integración con admin

- **Módulos Pendientes 🚧**
  - Noticias
  - Búsqueda
  - Mensajería
  - Recomendaciones

### Próximos Pasos

- Implementar módulo de noticias
- Desarrollar sistema de mensajería
- Integrar recomendaciones
- Mejorar el sistema de búsqueda

## [2025-03-12] Implementación del Módulo de Noticias y Sistema de Suscripciones

### feat(noticias): Implementación completa del módulo de noticias

#### Modelos y Estructura Base
- **Implementación de modelos principales:**
  - Modelo `Noticia` con campos para título, contenido, estado, tags, etc.
  - Modelo `Suscripcion` para gestionar suscripciones de usuarios
  - Integración con modelos existentes (Libro, Categoria, Usuario)

#### Sistema de Administración
- **Configuración del panel administrativo:**
  - Interfaz personalizada para gestión de noticias
  - Panel de control para suscripciones
  - Filtros y búsqueda avanzada
  - Asignación automática de autores

#### API REST y Endpoints
- **Implementación de ViewSets y Serializers:**
  - `NoticiaViewSet` con permisos diferenciados
  - `SuscripcionViewSet` con endpoint personalizado
  - Documentación Swagger/OpenAPI
  - Filtros y ordenamiento

#### Sistema de Notificaciones
- **Implementación del sistema de emails:**
  - Plantillas HTML personalizadas
  - Notificaciones automáticas para nuevos libros
  - Emails de confirmación de suscripción
  - Sistema de tags y categorización

#### Integración con Libros
- **Automatización y relaciones:**
  - Creación automática de noticias al añadir libros
  - Sistema de tags basado en categorías
  - Relaciones entre libros y noticias
  - Filtrado por categorías suscritas

#### Optimizaciones y Mejoras
- **Mejoras en el sistema:**
  - Optimización de señales para evitar emails duplicados
  - Corrección de importaciones (`LibroSerializer`)
  - Mejora en la documentación de la API
  - Implementación de pruebas unitarias

### Estado Actual del Sistema

#### Funcionalidades Implementadas ✅
- **Gestión de Noticias**
  - CRUD completo de noticias
  - Sistema de estados (borrador/publicado)
  - Asignación automática de autores
  - Tags y categorización

- **Sistema de Suscripciones**
  - Suscripción por categorías
  - Notificaciones personalizadas
  - Gestión de preferencias
  - Emails de confirmación

- **Notificaciones Automáticas**
  - Emails HTML personalizados
  - Notificaciones de nuevos libros
  - Sistema de plantillas
  - Control de duplicados

#### Endpoints Disponibles
- `/api/noticias/noticias/` (GET, POST)
- `/api/noticias/noticias/{id}/` (GET, PUT, PATCH, DELETE)
- `/api/noticias/suscripciones/` (GET, POST)
- `/api/noticias/suscripciones/{id}/` (GET, PUT, PATCH, DELETE)
- `/api/noticias/suscripciones/mis-noticias/` (GET)

### Próximos Pasos 🚧
1. Configurar URLs reales en emails
2. Implementar sistema de cola para emails
3. Añadir más pruebas de integración
4. Implementar control de frecuencia de emails
5. Mejorar la descripción en noticias automáticas
6. Configurar enlaces de desuscripción

### Notas Técnicas
- Backend de email configurado para desarrollo (consola)
- Integración completa con el sistema de autenticación
- Documentación API disponible en Swagger
- Pruebas unitarias implementadas para funcionalidades principales

## [2025-03-14] Implementación del Módulo de Mensajería

### feat(mensajeria): Implementación completa del sistema de mensajería

#### Modelos y Estructura Base
- **Implementación de modelos principales:**
  - Modelo `ForoPersonal` para gestión de foros individuales
  - Modelo `Mensaje` con sistema de estados y respuestas
  - Modelo `NotificacionMensaje` para notificaciones automáticas
  - Integración con el modelo de Usuario existente

#### Sistema de Administración
- **Configuración del panel administrativo:**
  - Interfaz personalizada para gestión de foros
  - Panel de control para mensajes y respuestas
  - Gestión de notificaciones
  - Filtros y búsqueda avanzada

#### API REST y Endpoints
- **Implementación de ViewSets y Serializers:**
  - `ForoPersonalViewSet` con permisos diferenciados
  - `MensajeViewSet` con acciones personalizadas
  - `NotificacionMensajeViewSet` para gestión de notificaciones
  - Documentación Swagger/OpenAPI completa
  - Filtros y ordenamiento configurados

#### Sistema de Señales Automáticas
- **Implementación de señales para automatización:**
  - Creación automática de foro personal al registrar usuario
  - Notificaciones automáticas para:
    - Nuevos mensajes en foro
    - Respuestas a mensajes
  - Actualización automática de estados de mensajes

#### Integración con Usuarios
- **Sistema de permisos y roles:**
  - Permisos diferenciados por tipo de usuario
  - Acceso restringido a foros personales
  - Sistema de notificaciones personalizado
  - Gestión de estados de mensajes

### Estado Actual del Sistema

#### Funcionalidades Implementadas ✅
- **Gestión de Foros**
  - Foros personales por usuario
  - Sistema de estados (activo/inactivo)
  - Creación automática al registro

- **Sistema de Mensajes**
  - CRUD completo de mensajes
  - Sistema de estados (abierto/respondido/cerrado)
  - Respuestas anidadas
  - Marcado de mensajes originales

- **Notificaciones Automáticas**
  - Notificaciones por nuevos mensajes
  - Notificaciones por respuestas
  - Sistema de marcado de leídos
  - Gestión de estados de notificación

#### Endpoints Disponibles
- `/api/mensajeria/foros/` (GET, POST)
- `/api/mensajeria/foros/{id}/` (GET, PUT, DELETE)
- `/api/mensajeria/mensajes/` (GET, POST)
- `/api/mensajeria/mensajes/{id}/` (GET, PUT, DELETE)
- `/api/mensajeria/mensajes/{id}/responder/` (POST)
- `/api/mensajeria/mensajes/{id}/cerrar/` (POST)
- `/api/mensajeria/notificaciones/` (GET, POST)
- `/api/mensajeria/notificaciones/{id}/` (GET, PUT, DELETE)
- `/api/mensajeria/notificaciones/{id}/marcar_leido/` (POST)

### Próximos Pasos 🚧
1. Resolver advertencias de tipos en Swagger
2. Implementar sistema de cola para notificaciones
3. Añadir pruebas de integración
4. Mejorar la documentación de la API
5. Implementar sistema de búsqueda en mensajes
6. Añadir soporte para archivos adjuntos

### Notas Técnicas
- Integración completa con el sistema de autenticación
- Documentación API disponible en Swagger
- Sistema de señales configurado en `apps.py`
- Pruebas unitarias implementadas para funcionalidades principales



# Registro de Cambios del Proyecto

## [2025-03-19] Corrección de Swagger y Actualización del Módulo de Compras

### fix(swagger): Resolución de problemas con la documentación Swagger

- **commit:** Corrección de integración de API Schema con módulos
  - Verificación y corrección de serializers en aplicaciones
  - Configuración adicional de DRF Spectacular en settings
  - Optimización de rutas y endpoints para compatibilidad Swagger
  - Solución de errores de carga en el esquema de API

#### Detalles de la implementación:

- **Serializers:**
  - Revisión y corrección de todos los serializers para mantener consistencia
  - Corrección de campos read_only en CarritoSerializer
  - Verificación de tipos de campos para compatibilidad con esquemas OpenAPI

- **Configuración:**
  - Actualización de SPECTACULAR_SETTINGS para mejorar manejo de errores
  - Configuración de esquemas de seguridad JWT para autenticación
  - Simplificación de hooks de post-procesamiento para evitar errores

- **Integración:**
  - Verificación de inclusión correcta de todas las apps en URLs globales
  - Comprobación de compatibilidad de ViewSets con DRF Spectacular
  - Implementación de anotaciones OpenAPI para mejor documentación

---

### feat(compras): Mejora de la documentación y API del módulo de compras

- **commit:** Actualización y documentación del módulo de compras existente
  - Mejora de la documentación de acciones en CarritoViewSet
  - Implementación de acciones personalizadas para el carrito (vaciar, agregar/quitar libro)
  - Optimización de permisos para operaciones CRUD
  - Preparación para integración con módulo de finanzas

#### Detalles de la implementación:

- **Acciones Mejoradas:**
  - Implementación de acción `vaciar` para limpiar carritos
  - Acción `agregar_libro` con validación de parámetros
  - Acción `quitar_libro` con manejo de errores
  - Documentación detallada para todas las acciones

- **Documentación API:**
  - Uso de decoradores `extend_schema` y `extend_schema_view` para mejorar documentación
  - Parámetros OpenAPI implementados para todas las acciones
  - Descripciones detalladas de los endpoints y sus funcionalidades
  - Respuestas HTTP documentadas con códigos de estado apropiados

---

### Estado Actual del Sistema

#### Módulos Completamente Funcionales ✅
- **Libros**
  - Modelo completo con categorías
  - API REST documentada
  - Panel administrativo optimizado
  - Sistema de búsqueda integrado

- **Usuarios**
  - Sistema de autenticación JWT
  - Gestión de permisos y roles
  - Endpoints documentados
  - Integración con admin

- **Compras (Básico)**
  - Modelo Carrito implementado
  - Operaciones CRUD y acciones personalizadas
  - Documentación Swagger completa
  - Endpoints funcionales

- **Búsqueda**
  - Sistema de búsqueda flexible
  - Filtros avanzados implementados
  - Historial de consultas
  - Documentación completa

- **Noticias**
  - Sistema de noticias completo
  - Suscripciones implementadas
  - Notificaciones automáticas
  - API documentada

- **Mensajería**
  - Foros personales por usuario
  - Sistema de mensajes con estados
  - Notificaciones automáticas
  - API con documentación completa

#### Módulos Parcialmente Implementados 🚧
- **Finanzas**
  - Modelos básicos creados
  - Integración con admin
  - Falta completar API REST
  - Pendiente integración con Compras

#### Funcionalidades Pendientes 🔄
- **Compras**
  - Sistema de reservas con temporalidad
  - Gestión de devoluciones
  - Seguimiento de envíos
  - Historial completo de transacciones

- **Recomendaciones**
  - Implementación completa del modelo
  - Algoritmo de recomendación
  - API para sugerencias
  - Integración con compras y búsquedas

---

### Próximos Pasos

1. **Completar la integración entre Compras y Finanzas**
   - Implementar método `pagar()` en Carrito
   - Crear endpoint para procesamiento de pagos
   - Integrar con modelos de Tarjeta y Saldo

2. **Desarrollar sistema de reservas**
   - Implementar modelo Reserva
   - Configurar temporalidad de 24 horas
   - Añadir validaciones de cantidad

3. **Crear sistema de devoluciones**
   - Modelo para registro de devoluciones
   - Generación de códigos QR
   - Sistema de validación de plazos

4. **Implementar seguimiento de envíos**
   - Modelo de Envío con estados
   - Opciones de recogida en tienda
   - Visualización de ubicaciones

5. **Iniciar desarrollo del módulo de recomendaciones**
   - Diseñar modelo de Recomendación
   - Implementar algoritmo básico
   - Integrar con historial de compras y búsquedas

---

## Nota sobre configuración de Swagger y buenas prácticas

### Workflow para hacer funcionar Swagger correctamente

1. **Verificar serializers:**
   - Asegurar que todos los serializers tengan definiciones de campos correctas
   - Cuando se usa `read_only_fields`, asegurarse de que sea una tupla con coma final
   - Ejemplo: `read_only_fields = ('fecha',)` en lugar de `read_only_fields = ('fecha')`

2. **Configurar correctamente los ViewSets:**
   - Usar decoradores `@extend_schema_view` para documentar cada método
   - Implementar `@action` con documentación `@extend_schema` para acciones personalizadas
   - Proporcionar descripciones detalladas para todos los parámetros y respuestas

3. **Integrar URLs correctamente:**
   - Cada app debe tener su propio archivo `urls.py`
   - Todas las apps deben estar registradas en `config/urls.py`
   - Usar prefijos coherentes como `/api/[app_name]/`

4. **Configuración en settings.py:**
   - Asegurar que `drf_spectacular` esté en `INSTALLED_APPS`
   - Configurar `SPECTACULAR_SETTINGS` con los valores adecuados
   - Incluir configuración JWT para autenticación en la documentación

5. **Para un nuevo módulo:**
   - Crear un router en el archivo `urls.py` del módulo
   - Registrar todos los ViewSets con nombres de base apropiados
   - Incluir las URLs del módulo en `config/urls.py`
   - Verificar la carga de la documentación después de cada cambio
   - Utilizar `extend_schema` para documentar detalladamente cada endpoint

6. **Manejo de errores:**
   - Verificar logs del servidor cuando hay errores de carga en Swagger
   - Resolver problemas uno por uno, comenzando por serializers y modelos
   - Simplificar configuraciones complejas que puedan estar causando problemas
   - Usar ventanas de incógnito o limpiar caché del navegador para pruebas

Siguiendo estos pasos, se garantiza que cada nuevo módulo se integre correctamente con la documentación Swagger, facilitando el desarrollo y prueba de la API.

## [2025-03-26] Corrección y Documentación del Sistema de Autenticación

### fix(auth): Corrección del endpoint de autenticación en componente Login

#### Detalles del cambio
- **commit:** Corrección del endpoint de autenticación JWT en componente Login
  - **Modificado:** Endpoint de login para usar correctamente la ruta JWT
  - **Anterior:** Intentaba usar un endpoint inexistente
  - **Actual:** Utiliza el endpoint `/api/token/` proporcionado por SimpleJWT
  - **Implementado:** Manejo correcto de tokens (access y refresh)
  - **Actualizado:** Almacenamiento de tokens en localStorage

### feat(docs): Documentación del workflow de autenticación

#### Documentación del sistema de autenticación
- **Diferenciación entre registro y login:**
  - **Registro:** Usa endpoint `/api/usuarios/` (POST) - ViewSet estándar
  - **Login:** Usa endpoint `/api/token/` (POST) - Sistema JWT dedicado
  - **Documentación:** Clarificación de diferencias en Swagger y código

- **Workflow de autenticación JWT:**
  - **Obtención de token:** POST a `/api/token/` con username/password
  - **Almacenamiento:** LocalStorage para tokens (access y refresh)
  - **Uso:** Envío de token en header `Authorization: Bearer [token]`
  - **Renovación:** Uso de refresh token cuando el token principal expira

- **Mejoras en la documentación Swagger:**
  - **Implementación:** Decoradores `extend_schema` para endpoints de usuarios
  - **Detalle:** Documentación clara de parámetros y respuestas
  - **Ejemplos:** Ejemplos de uso para login y registro

### feat(swagger): Mejora de la documentación OpenAPI para usuarios

- **commit:** Ampliación de la documentación Swagger para el módulo de usuarios
  - **Añadido:** Descripción detallada para cada endpoint
  - **Implementado:** Ejemplos de solicitudes y respuestas
  - **Documentado:** Tipos de errores y códigos de estado
  - **Clarificado:** Flujo completo de autenticación y uso de JWT

### Estado Actual del Sistema

#### Sistema de Autenticación ✅
- **Registro de usuarios:** Completamente funcional
  - Endpoint: `/api/usuarios/` (POST)
  - No requiere autenticación
  - Documentado en Swagger

- **Login JWT:** Completamente funcional
  - Endpoint: `/api/token/` (POST)
  - Devuelve tokens access y refresh
  - Manejo de errores implementado

- **Perfil de usuario:** Completamente funcional
  - Endpoint: `/api/usuarios/perfil/` (GET)
  - Requiere autenticación
  - Devuelve datos del usuario actual

- **Cambio de contraseña:** Completamente funcional
  - Endpoint: `/api/usuarios/{id}/cambiar_contraseña/` (POST)
  - Requiere autenticación
  - Valida contraseña actual

#### Frontend de Autenticación ✅
- **Componente Login:** Corregido y funcional
  - Usa correctamente el endpoint JWT
  - Almacena tokens en localStorage
  - Manejo de errores implementado
  - Redirección automática tras login exitoso

- **Componente Registro:** Completamente funcional
  - Validación de campos
  - Comunicación correcta con backend
  - Redirección a login tras registro exitoso

### Workflow Actual de Autenticación

1. **Registro:**
   - Usuario completa formulario en `/registro`
   - Frontend envía datos a `/api/usuarios/` (POST)
   - Backend valida y crea usuario
   - Usuario recibe confirmación y es redirigido a login

2. **Login:**
   - Usuario ingresa credenciales en `/login`
   - Frontend envía username/password a `/api/token/` (POST)
   - Backend valida y devuelve tokens JWT
   - Frontend almacena tokens en localStorage
   - Usuario es redirigido a página principal

3. **Autorización:**
   - Cada petición autenticada incluye token JWT en header
   - Backend valida token y permite/deniega acceso
   - Si token expira, se usa refresh token para obtener uno nuevo

4. **Gestión de perfil:**
   - Usuario autenticado puede ver/modificar su perfil
   - Cambios de contraseña requieren validación de contraseña actual
   - Acciones privilegiadas requieren roles específicos

### Próximos Pasos 🚧

1. **Implementar recuperación de contraseña**
   - Crear endpoint para generación de tokens de recuperación
   - Implementar sistema de envío de emails
   - Desarrollar interfaz para restablecimiento de contraseña

2. **Mejorar gestión de sesiones**
   - Implementar logout que invalide tokens
   - Añadir detección de inactividad
   - Permitir gestión de sesiones múltiples

3. **Ampliar permisos por roles**
   - Refinar permisos para cada tipo de usuario
   - Documentar matriz de permisos en Swagger
   - Implementar pruebas de autorización


## [2025-03-27] Implementacion de recuperar contraseña
### feat(usuarios): Implementación del sistema de recuperación de contraseñas

#### Detalles del cambio:
- **Endpoint de Recuperación de Contraseña:**
  - Se agregó el método `recuperar_contraseña` en el `UsuarioViewSet`.
  - Permite a los usuarios no autenticados solicitar un correo para restablecer su contraseña.
  - El correo incluye un enlace o instrucciones para restablecer la contraseña.

- **Validación de Correo Electrónico:**
  - Se implementó el serializador `RecuperarContraseñaSerializer` para validar que el correo proporcionado exista en la base de datos.

- **Configuración de Permisos:**
  - Se ajustaron los permisos en el método `get_permissions` para permitir acceso público al endpoint `recuperar_contraseña`.

- **Configuración de Envío de Correos:**
  - Se configuró el backend de correo SMTP utilizando Gmail.
  - Se documentó cómo generar una contraseña de aplicación para evitar errores de autenticación.

#### Documentación:
- **Swagger:** Se agregó documentación detallada al endpoint `recuperar_contraseña` utilizando `drf-spectacular`.
- **Respuestas Documentadas:**
  - **200 OK:** Correo enviado correctamente.
  - **400 Bad Request:** El correo no fue proporcionado.
  - **404 Not Found:** No se encontró un usuario con el correo proporcionado.

#### Próximos Pasos:
1. Implementar un endpoint para restablecer la contraseña con un token temporal.
2. Mejorar la seguridad del flujo de recuperación de contraseñas.
3. Implementar pruebas unitarias para validar el flujo completo.

## [2025-04-11] Corrección de Modelos y Configuración del Proyecto
### fix(compras): Corrección del modelo Carrito y relaciones en compras
- **commit:** Corregido el modelo Carrito y sus administradores
  - **Resuelto:** Conflicto entre el campo libros ManyToManyField y métodos en el modelo Carrito
  - **Corregido:** Método total_libros() para contar correctamente los libros en el carrito
  - **Implementado:** Métodos para agregar, quitar y limpiar libros del carrito
  - **Refactorizado:** Admin de Carrito para visualizar correctamente los libros

#### Detalles de la implementación:
- **Administración de carritos:**
  - Corregido error en filter_horizontal para la relación ManyToManyField
  - Implementadas acciones en admin para vaciar carritos y agregar libros
  - Añadidos métodos para cálculo de total y conteo de libros

- **Resolución de errores:**
  - Solucionado el problema de conflicto entre campo y método con el mismo nombre
  - Implementado método obtener_libros() para reemplazar al método libros()
  - Corregida la visualización en admin panel con campos personalizados

### fix(finanzas): Implementación correcta de OneToOneField en modelos de finanzas
- **commit:** Corregidas relaciones entre modelos de finanzas y usuarios
  - **Modificado:** Relación OneToOneField entre Usuario y Saldo
  - **Corregido:** Método modificar_saldo() para guardar los cambios correctamente
  - **Implementado:** Método __str__ para mejor representación en admin
  - **Optimizado:** Serializer de Saldo para gestión de usuarios

#### Detalles de la implementación:
- **Estructura de modelos:**
  - Implementación correcta de OneToOneField para relación única entre Usuario y Saldo
  - Eliminada la redundancia de unique=True en campo OneToOneField
  - Corregida la definición de campos en el modelo Saldo
  - Implementados métodos para gestionar el saldo correctamente

- **Correcciones de APIs:**
  - Corregidas importaciones en views.py utilizando importaciones relativas
  - Implementado SaldoViewSet para gestión del saldo por usuario
  - Ajustado el serializer para representar correctamente las relaciones

### fix(admin): Solución de problemas con archivos estáticos y configuración
- **commit:** Corregida la configuración para servir archivos estáticos
  - **Resuelto:** Error 404 en rutas de admin sin trailing slash
  - **Configurado:** Servicio correcto de archivos estáticos en desarrollo
  - **Implementado:** Manejo de URLs con APPEND_SLASH
  - **Optimizado:** Sistema de migraciones para resolver dependencias

#### Detalles de la implementación:
- **Configuración de estáticos:**
  - Configurados correctamente STATIC_URL y STATIC_ROOT en settings.py
  - Implementado servicio de archivos estáticos en modo DEBUG
  - Resueltos problemas de rutas para admin y otros recursos estáticos

- **Gestión de migraciones:**
  - Corregidas dependencias entre migraciones para evitar errores
  - Implementado proceso para rehacer migraciones con problemas
  - Solucionado error de inconsistencia entre migraciones de libros y compras

### Estado Actual del Sistema

#### Módulos Corregidos ✅
- **Compras**
  - Modelo Carrito completamente funcional
  - Relaciones ManyToManyField configuradas correctamente
  - Admin con acciones personalizadas
  - Métodos para gestión de libros en carrito

- **Finanzas**
  - Modelos Tarjeta y Saldo con relaciones OneToOneField correctas
  - Serializers implementados para gestión vía API
  - Métodos para modificación y visualización de datos
  - Integración con sistema de admin

#### Mejoras en Infraestructura ✅
- **Archivos Estáticos**
  - Configuración correcta para servir estáticos en desarrollo
  - Solución para rutas de admin
  - Manejo de URLs con/sin trailing slash

- **Sistema de Migraciones**
  - Proceso definido para resolver dependencias circulares
  - Corrección de inconsistencias entre aplicaciones
  - Manejo adecuado de migraciones en PostgreSQL

#### Validaciones y Seguridad ✅
- **Integridad de Datos**
  - Corregidas relaciones entre modelos
  - Implementadas validaciones en métodos de modelos
  - Métodos save() configurados para persistir cambios correctamente

### Próximos Pasos 🚧
- Completar integraciones entre módulos de compras y finanzas
- Implementar vistas personalizadas para gestión de saldo
- Desarrollar pruebas automatizadas para modelos corregidos
- Mejorar la documentación de API en Swagger/OpenAPI
- Optimizar consultas de base de datos en modelos con relaciones complejas

## [2025-04-15] Implementación y Mejora de la Gestión del Perfil de Usuario

### feat(usuarios): Implementación completa del sistema de edición de perfil

#### Detalles del cambio:
- **commit:** Implementación de endpoints para la gestión completa del perfil de usuario
  - **Implementado:** Endpoint para actualizar datos del perfil de usuario
  - **Documentado:** Campos actualizables y validaciones
  - **Optimizado:** Serializer específico para actualización de perfil
  - **Configurado:** Sistema de permisos para garantizar que cada usuario solo edite su propio perfil

#### Funcionalidad de actualización de perfil:
- **Sistema de Actualización de Perfil:**
  - Endpoint `/api/usuarios/actualizar_perfil/` (PUT, PATCH)
  - Permite actualización de datos personales: nombres, apellidos, teléfono, dirección y fecha de nacimiento
  - Validación de datos antes de actualizar
  - Permisos configurados para acceso solo a usuarios autenticados
  - Serializer específico (ProfileUpdateSerializer) que protege campos sensibles

- **Documentación API:**
  - Uso de decoradores `extend_schema` para documentación completa en Swagger
  - Ejemplos de uso incluidos en la documentación
  - Descripción detallada de los campos actualizables
  - Documentación de posibles errores y respuestas

#### Estado Actual de la Funcionalidad de Gestión de Perfil ✅

- **Implementación Completa:**
  - Modelo Usuario con campos completos para información personal
  - Serializers especializados para diferentes operaciones:
    - `UsuarioSerializer`: Visualización completa de datos
    - `ProfileUpdateSerializer`: Actualización segura de perfil
  - ViewSet con métodos especializados:
    - `perfil`: Obtener datos del perfil propio (GET)
    - `actualizar_perfil`: Modificar datos personales (PUT/PATCH)
    
- **Endpoints Disponibles:**
  - **GET** `/api/usuarios/perfil/` - Obtiene los datos del perfil del usuario autenticado
  - **PUT/PATCH** `/api/usuarios/actualizar_perfil/` - Actualiza los datos personales del usuario

- **Seguridad Implementada:**
  - Validación de datos de entrada
  - Control de campos actualizables (no permite modificar campos críticos)
  - Autenticación requerida para todas las operaciones
  - Verificación de permisos de acceso

#### Aspectos Técnicos

- **Modelo Usuario:**
  - Extiende de AbstractUser para mantener compatibilidad con Django
  - Campos adicionales: tipo_usuario, numero_identificacion, teléfono, dirección, fecha_nacimiento
  - Metadatos: fecha_registro, ultima_actualizacion, activo

- **ProfileUpdateSerializer:**
  - Únicamente expone campos seguros para actualización: first_name, last_name, telefono, direccion, fecha_nacimiento
  - Implementa validaciones específicas para cada campo
  - Método update optimizado para actualización segura

- **Mejoras de Usabilidad:**
  - Respuesta formateada con datos completos tras actualización exitosa
  - Mensajes de error descriptivos en caso de datos inválidos
  - Documentación completa para integración con frontend

### Próximos Pasos 🚧

1. **Implementar subida de foto de perfil**
   - Añadir campo de imagen al modelo Usuario
   - Implementar endpoint para subida/actualización de foto
   - Configurar almacenamiento adecuado para imágenes

2. **Mejorar sistema de validación de datos**
   - Implementar validaciones más estrictas para números telefónicos
   - Añadir validación de edad mínima en fecha_nacimiento
   - Validar formato de direcciones

3. **Expandir gestión de preferencias de usuario**
   - Mejorar integración con sistema de preferencias
   - Implementar gestión de notificaciones por usuario
   - Permitir configuración de privacidad

   # Registro de Cambios del Proyecto

## [2025-04-25] Corrección y Mejora de los Módulos de Finanzas y Usuarios

### **fix(finanzas): Corrección de modelos y mejoras en la API**

#### **Detalles del cambio:**
- **commit:** Corrección de los modelos `Tarjeta` y `Saldo` para mejorar la funcionalidad y la integración con el sistema de usuarios.
  - **Modificado:** Método `modificar_saldo` en el modelo `Saldo` para validar la existencia de una tarjeta antes de modificar el saldo.
  - **Implementado:** Método `__str__` en ambos modelos para mejorar la representación en el panel de administración.
  - **Optimizado:** Serializador `SaldoSerializer` para exponer correctamente el campo `usuario_id`.

#### **Mejoras en la API:**
- **SaldoViewSet:**
  - Implementado ViewSet para gestionar saldos.
  - Configurado con permisos `IsAuthenticatedOrReadOnly`.
  - Añadido soporte para filtros en el campo `saldo`.

- **TarjetaViewSet:**
  - Configurado ViewSet para gestionar tarjetas.
  - Añadida documentación detallada con `drf-spectacular`.

#### **Documentación API:**
- **Endpoints Disponibles:**
  - **GET** `/api/finanzas/tarjetas/` - Lista de tarjetas.
  - **POST** `/api/finanzas/tarjetas/` - Crear una nueva tarjeta.
  - **GET** `/api/finanzas/saldos/` - Lista de saldos.
  - **POST** `/api/finanzas/saldos/` - Crear un nuevo saldo.

- **Swagger/OpenAPI:**
  - Documentación completa de los endpoints con ejemplos de uso.
  - Parámetros personalizados documentados con `OpenApiParameter`.

---

### **feat(usuarios): Mejora del modelo Usuario y gestión de preferencias**

#### **Detalles del cambio:**
- **commit:** Ampliación del modelo `Usuario` con nuevos campos y mejoras en la API.
  - **Añadido:** Campo `foto_perfil` para permitir la subida de imágenes de perfil.
  - **Añadido:** Campo `nacionalidad` para almacenar la nacionalidad del usuario.
  - **Optimizado:** Serializador `UsuarioRegistroSerializer` para validar y registrar usuarios con los nuevos campos.

#### **Mejoras en la API:**
- **Endpoints de Usuario:**
  - **GET** `/api/usuarios/perfil/` - Obtiene los datos del perfil del usuario autenticado.
  - **PUT/PATCH** `/api/usuarios/actualizar_perfil/` - Actualiza los datos personales del usuario.
  - **POST** `/api/usuarios/recuperar_contraseña/` - Envía un correo para recuperar la contraseña.

- **Preferencias de Usuario:**
  - Implementado modelo `UsuarioPreferencias` para gestionar las preferencias de suscripción.
  - Añadidos endpoints para obtener y actualizar las preferencias:
    - **GET** `/api/usuarios/preferencias_suscripcion/`
    - **PUT/PATCH** `/api/usuarios/actualizar_preferencias/`

#### **Documentación API:**
- **Swagger/OpenAPI:**
  - Documentación detallada de los endpoints de usuario.
  - Ejemplos de uso para registro, actualización de perfil y recuperación de contraseña.

---

### **fix(admin): Mejoras en la configuración del panel administrativo**

#### **Detalles del cambio:**
- **commit:** Configuración avanzada del panel administrativo para los modelos `Usuario`, `Tarjeta` y `Saldo`.
  - **Usuario:**
    - Añadidos filtros por `tipo_usuario` y `activo`.
    - Configurada búsqueda por `username` y `email`.
  - **Tarjeta:**
    - Configurada visualización de `numero` y `titular`.
    - Añadida búsqueda por `numero`.
  - **Saldo:**
    - Configurada visualización de `usuario` y `saldo`.
    - Añadida búsqueda por `usuario`.

---

### **Estado Actual del Sistema**

#### **Módulos Completamente Funcionales ✅**
- **Usuarios:**
  - Modelo extendido con nuevos campos (`foto_perfil`, `nacionalidad`).
  - API REST funcional con endpoints para perfil y preferencias.
  - Sistema de recuperación de contraseña implementado.

- **Finanzas:**
  - Modelos `Tarjeta` y `Saldo` completamente funcionales.
  - API REST funcional con endpoints para tarjetas y saldos.
  - Integración con el sistema de usuarios.

#### **Mejoras en Infraestructura ✅**
- **Archivos Estáticos:**
  - Configuración correcta para servir imágenes de perfil.
  - Integración con `MEDIA_ROOT` y `MEDIA_URL`.

- **Panel Administrativo:**
  - Configuración avanzada para los modelos `Usuario`, `Tarjeta` y `Saldo`.
  - Mejoras en la visualización y búsqueda.

---

### **Próximos Pasos 🚧**
1. **Completar integración entre Finanzas y Compras:**
   - Implementar método `pagar()` en el modelo `Carrito`.
   - Crear endpoint para procesar pagos.

2. **Mejorar validaciones en el modelo Usuario:**
   - Validar formato de `foto_perfil`.
   - Añadir validación de edad mínima en `fecha_nacimiento`.

3. **Desarrollar pruebas automatizadas:**
   - Implementar pruebas unitarias para los modelos y serializadores.
   - Añadir pruebas de integración para los endpoints.

4. **Optimizar consultas en la API:**
   - Reducir el número de consultas a la base de datos en los ViewSets.
   - Implementar `select_related` y `prefetch_related` donde sea necesario.

5. **Documentar completamente el flujo de recuperación de contraseña:**
   - Añadir ejemplos detallados en Swagger.
   - Implementar pruebas para validar el flujo completo.


## [2025-04-29] Mejora de Seguridad en el Sistema de Recuperación de Contraseñas

### feat(usuarios): Implementación segura del sistema de recuperación de contraseñas

#### Detalles del cambio:
- **commit:** Reemplazo del método inseguro de recuperación de contraseña por un sistema de tokens temporales
  - **Problema anterior:** El endpoint `recuperar_contraseña` enviaba el hash de la contraseña por email
  - **Solución implementada:** Sistema de tokens temporales con validez limitada (15 minutos)
  - **Mejorado:** Flujo completo de recuperación con generación de token, validación y restablecimiento
  - **Implementado:** Modelo `TokenRecuperacionPassword` para gestión segura de tokens

#### Componentes implementados:
- **Modelo para tokens de recuperación:**
  - Nuevo modelo `TokenRecuperacionPassword` con los siguientes campos:
    - `usuario` (ForeignKey a Usuario)
    - `token` (UUIDField único generado automáticamente)
    - `fecha_creacion` (DateTimeField auto_now_add)
    - `fecha_expiracion` (DateTimeField con validez de 15 minutos)
    - `usado` (BooleanField para controlar uso único del token)
  - Métodos del modelo:
    - `esta_activo` (property para verificar validez del token)
    - `generar_token` (método de clase para crear tokens e invalidar anteriores)

- **Serializers para el flujo de recuperación:**
  - `ValidarTokenSerializer` para verificar la validez de un token
  - `RestablecerContraseñaSerializer` para procesar la solicitud de cambio de contraseña

- **Endpoints implementados:**
  - **POST** `/api/usuarios/recuperar_contraseña/` - Solicita un token de recuperación vía email
  - **POST** `/api/usuarios/validar_token/` - Verifica la validez de un token recibido
  - **POST** `/api/usuarios/restablecer_contraseña/` - Establece una nueva contraseña usando un token válido

#### Aspectos de seguridad:
- **Flujo completo de recuperación seguro:**
  - No se envían contraseñas (ni hashes) por email
  - Tokens con tiempo de vida limitado (15 minutos)
  - Tokens de un solo uso que se marcan como "usados" tras su utilización
  - Invalidación automática de tokens anteriores al generar uno nuevo
  - Verificación de token previa al cambio de contraseña

- **Mejoras del correo electrónico:**
  - Formato más profesional y claro
  - Inclusión de enlace directo al formulario de recuperación
  - Advertencia sobre tiempo de validez del enlace
  - Instrucciones en caso de no haber solicitado el cambio

#### Ventajas del nuevo sistema:
- Mayor seguridad al seguir buenas prácticas de la industria
- Flujo claro y usable para el usuario final
- Protección contra ataques de fuerza bruta
- Trazabilidad completa de los intentos de recuperación
- Administración de tokens a través del panel de admin

#### Panel de administración:
- Configurado panel administrativo para el modelo `TokenRecuperacionPassword`
- Listados con información relevante: usuario, token, estado, fecha
- Filtros por estado (usado/activo) y fecha de creación
- Búsqueda por usuario y email

### Estado Actual de la Funcionalidad ✅

- **Implementación Completa:**
  - Modelo para gestión de tokens de recuperación
  - Serializers para validación y procesamiento 
  - Endpoints para el flujo completo de recuperación
  - Sistema de envío de emails configurado
  - Administración desde el panel Django admin

- **Seguridad mejorada:**
  - Tokens únicos con UUID4
  - Tiempo de validez limitado
  - Control de tokens usados
  - Invalidación automática de tokens anteriores
  - Validaciones en múltiples niveles (serializer y vista)

- **Documentación API:**
  - Endpoints documentados con `extend_schema`
  - Ejemplos de uso incluidos
  - Descripción detallada de parámetros y respuestas
  - Explicación de códigos de error

### Próximos Pasos 🚧

1. **Actualizar el frontend para implementar el flujo completo:**
   - Crear componente `ResetPassword.jsx` para restablecer contraseña
   - Implementar validación del token en frontend
   - Añadir formulario para nueva contraseña con validación

2. **Mejorar experiencia de usuario:**
   - Añadir retroalimentación sobre expiración de tokens
   - Implementar redirecciones inteligentes basadas en el estado del token
   - Mejorar mensajes de error para casos específicos

3. **Ampliar pruebas:**
   - Implementar pruebas unitarias para cada componente del flujo
   - Añadir pruebas de integración para el proceso completo
   - Probar casos de error y recuperación

4. **Optimizar sistema de correos:**
   - Implementar plantillas HTML para emails más atractivos
   - Configurar sistema de cola para envío asíncrono de correos
   - Añadir seguimiento de correos enviados

   ## [2025-04-29] Mejora de la Gestión de Usuarios y Visualización en el Panel Administrativo

### feat(usuarios): Implementación de la visualización de la foto de perfil en el panel administrativo

#### Detalles del cambio:
- **commit:** Se agregó la funcionalidad para mostrar la foto de perfil de los usuarios en el panel administrativo.
  - **Implementado:** Método `mostrar_foto_perfil` en la clase `UsuarioAdmin` para renderizar la imagen de perfil en la lista de usuarios.
  - **Configurado:** Campo `foto_perfil` en el modelo `Usuario` para almacenar imágenes de perfil.
  - **Optimizado:** Visualización de imágenes con un tamaño fijo de 50x50 píxeles y estilo redondeado.

#### Cambios en el Modelo:
- **Modelo `Usuario`:**
  - Campo `foto_perfil` configurado como `ImageField` con validación de formatos (`jpg`, `jpeg`, `png`, `webp`).
  - Configuración de la carpeta de subida de imágenes en `MEDIA_ROOT`.

#### Cambios en el Panel Administrativo:
- **Clase `UsuarioAdmin`:**
  - Se agregó el método `mostrar_foto_perfil` para mostrar la imagen de perfil en la lista de usuarios.
  - Se añadió la columna "Foto de perfil" en la lista de usuarios.
  - Se configuró el campo `foto_perfil` en los formularios de edición y creación de usuarios.

#### Documentación API:
- **Endpoints relacionados:**
  - **PUT/PATCH** `/api/usuarios/actualizar_perfil/` - Permite a los usuarios actualizar su foto de perfil junto con otros datos personales.

---

### feat(admin): Mejoras en la configuración del panel administrativo

#### Detalles del cambio:
- **commit:** Se mejoró la configuración del panel administrativo para los modelos `Usuario` y `TokenRecuperacionPassword`.
  - **Usuario:**
    - Añadida la columna "Foto de perfil" en la lista de usuarios.
    - Configurada la búsqueda por `username` y `email`.
    - Añadidos filtros por `tipo_usuario` y `activo`.
  - **TokenRecuperacionPassword:**
    - Añadida la columna "¿Activo?" para mostrar el estado del token.
    - Configurada la búsqueda por `usuario` y `email`.
    - Añadidos filtros por estado (`usado`) y fecha de creación.

---

### Estado Actual del Sistema

#### Funcionalidades Implementadas ✅
- **Usuarios:**
  - Visualización de la foto de perfil en el panel administrativo.
  - API para actualizar la foto de perfil del usuario.
  - Modelo `Usuario` extendido con el campo `foto_perfil`.

- **Panel Administrativo:**
  - Configuración avanzada para los modelos `Usuario` y `TokenRecuperacionPassword`.
  - Mejoras en la visualización y búsqueda.

#### Mejoras en Infraestructura ✅
- **Archivos Multimedia:**
  - Configuración correcta para servir imágenes de perfil.
  - Integración con `MEDIA_ROOT` y `MEDIA_URL`.

---

### Próximos Pasos 🚧
1. **Completar pruebas unitarias:**
   - Implementar pruebas para la funcionalidad de subida de imágenes.
   - Validar el flujo completo de actualización de perfil.

2. **Optimizar la gestión de imágenes:**
   - Implementar redimensionamiento automático de imágenes al subirlas.
   - Configurar un sistema de almacenamiento en la nube para producción.

3. **Ampliar la funcionalidad del perfil de usuario:**
   - Permitir la eliminación de la foto de perfil.
   - Añadir validaciones adicionales para el formato y tamaño de las imágenes.


   ## [2025-04-30] Corrección y Mejora de la Gestión de Preferencias y Perfil de Usuario

### feat(usuarios): Implementación y mejora de la gestión de preferencias de usuario

#### Detalles del cambio:
- **commit:** Se implementaron endpoints para agregar y eliminar preferencias de usuario.
  - **Implementado:** Métodos `agregar_preferencia` y `eliminar_preferencia` en el modelo `UsuarioPreferencias`.
  - **Configurado:** Validación para asegurar que las preferencias sean válidas (autores o categorías existentes).
  - **Optimizado:** Uso de `ArrayField` para almacenar las preferencias como una lista.

#### Cambios en el Modelo:
- **Modelo `UsuarioPreferencias`:**
  - Campo `preferencias` configurado como `ArrayField` para almacenar una lista de preferencias.
  - Métodos implementados:
    - `agregar_preferencia(preferencia)`: Agrega una preferencia válida a la lista.
    - `eliminar_preferencia(preferencia)`: Elimina una preferencia existente de la lista.

#### Cambios en la API:
- **Endpoints relacionados:**
  - **POST** `/api/usuarios/agregar_preferencia/` - Agrega una preferencia a la lista del usuario.
  - **DELETE** `/api/usuarios/eliminar_preferencia/` - Elimina una preferencia de la lista del usuario.

#### Documentación API:
- **Swagger/OpenAPI:**
  - Documentación detallada de los endpoints con ejemplos de uso.
  - Parámetros personalizados documentados con `OpenApiParameter`.

---

### feat(usuarios): Mejora en la gestión del perfil de usuario

#### Detalles del cambio:
- **commit:** Se mejoró el endpoint para actualizar el perfil del usuario.
  - **Implementado:** Soporte para subir imágenes de perfil.
  - **Validado:** Tamaño máximo de la imagen (2 MB).
  - **Optimizado:** Serializador `ProfileUpdateSerializer` para manejar archivos.

#### Cambios en la API:
- **Endpoints relacionados:**
  - **PUT/PATCH** `/api/usuarios/actualizar_perfil/` - Permite actualizar datos personales y la foto de perfil.

#### Documentación API:
- **Swagger/OpenAPI:**
  - Documentación detallada del endpoint con ejemplos de uso.
  - Validaciones documentadas para el tamaño y formato de la imagen.

---

### feat(admin): Mejoras en la configuración del panel administrativo

#### Detalles del cambio:
- **commit:** Se mejoró la visualización de las preferencias y la foto de perfil en el panel administrativo.
  - **Usuario:**
    - Añadida la columna "Foto de perfil" en la lista de usuarios.
    - Configurada la búsqueda por `username` y `email`.
    - Añadidos filtros por `tipo_usuario` y `activo`.
  - **UsuarioPreferencias:**
    - Configurada la visualización de las preferencias en el panel administrativo.

---

### Estado Actual del Sistema

#### Funcionalidades Implementadas ✅
- **Preferencias de Usuario:**
  - Gestión completa de preferencias (agregar y eliminar).
  - Validación de preferencias válidas (autores o categorías existentes).
  - Almacenamiento eficiente con `ArrayField`.

- **Perfil de Usuario:**
  - Actualización de datos personales.
  - Subida de imágenes de perfil con validaciones.
  - Respuesta detallada tras la actualización.

- **Panel Administrativo:**
  - Visualización de la foto de perfil en la lista de usuarios.
  - Gestión avanzada de preferencias en el panel administrativo.

---

### Próximos Pasos 🚧
1. **Completar pruebas unitarias:**
   - Implementar pruebas para la funcionalidad de gestión de preferencias.
   - Validar el flujo completo de actualización de perfil.

2. **Optimizar la gestión de imágenes:**
   - Implementar redimensionamiento automático de imágenes al subirlas.
   - Configurar un sistema de almacenamiento en la nube para producción.

3. **Ampliar la funcionalidad del perfil de usuario:**
   - Permitir la eliminación de la foto de perfil.
   - Añadir validaciones adicionales para el formato y tamaño de las imágenes.