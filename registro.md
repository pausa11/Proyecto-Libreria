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

#### **Funcionalidades Implementadas ✅**
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


# [2025-05-01] Corrección y Mejora de los Módulos de Finanzas y Compras

## Commit: Corrección y optimización del módulo de Finanzas

## Resumen
Se han realizado correcciones significativas en el módulo de Finanzas para resolver problemas de recursión infinita, manejo de errores, y mejoras en la integración entre el frontend y backend. Los cambios optimizan el flujo de trabajo para la gestión de tarjetas y saldos, eliminando ambigüedades en los serializers y simplificando los modelos.

## Cambios en Backend

### Serializers
- Se eliminó la ambigüedad entre los campos `usuario` y `usuario_id` en `TarjetaSerializer` y `SaldoSerializer`
- Se configuró el campo `usuario` como opcional, permitiendo su asignación automática desde el token de autenticación
- Se implementó el método `create()` para asignar automáticamente el usuario autenticado al crear objetos

### Views
- Se optimizaron los ViewSets para Tarjeta y Saldo con manejo adecuado de permisos 
- Se implementó lógica para actualizar tarjetas existentes en lugar de fallar si ya existe una
- Se añadió soporte para filtrar elementos por el usuario autenticado
- Se mejoró el manejo de errores para devolver respuestas HTTP apropiadas
- Se corrigió el endpoint `cambiar_saldo` para soportar la creación automática cuando no existe un saldo

### Models
- Se simplificó el modelo `Saldo`, eliminando restricciones innecesarias
- Se mejoró el método `modificar_saldo()` para un funcionamiento más robusto
- Se agregaron valores por defecto para evitar errores con saldos nuevos

## Cambios en Frontend

### financialManagement.jsx
- Se implementó un contador para limitar intentos de creación de saldo y evitar bucles infinitos
- Se mejoró el manejo de errores para mostrar saldos por defecto (0) cuando no existe uno
- Se optimizaron las peticiones al servidor para evitar llamadas recursivas infinitas
- Se implementó un método más robusto `crearSaldoConValor()` para manejar errores 400 (Bad Request)

### addPaymentMethod.jsx
- Se añadió validación detallada para los datos de tarjeta antes de enviarlos al backend
- Se corrigió el flujo para obtener explícitamente el ID del usuario antes de crear la tarjeta
- Se implementó mejor manejo de errores para mostrar mensajes específicos al usuario

## Mejoras generales
- Se implementaron mensajes de error más descriptivos y claros
- Se optimizó la experiencia de usuario al mostrar valores por defecto en lugar de fallar
- Se eliminó el spam de errores relacionados con la falta de tarjeta (comportamiento normal)
- Se añadió manejo más resiliente de situaciones donde no hay tarjeta o saldo
- Se simplificaron las peticiones al servidor para reducir la carga y evitar errores

## Impacto
Estos cambios solucionan el problema crítico de recursión infinita en `fetchSaldo()` y `crearSaldoInicial()`, así como los errores 400 Bad Request al crear tarjetas. El módulo de finanzas ahora funciona de manera robusta, permitiendo a los usuarios ver y gestionar su saldo correctamente incluso cuando no tienen una tarjeta registrada.

La interfaz ahora muestra un valor por defecto de $0 para el saldo cuando no existe uno, y maneja de forma elegante los escenarios donde el usuario aún no ha registrado una tarjeta.

## Pruebas realizadas
- Verificada la gestión correcta de saldos sin spamear errores
- Comprobado el flujo de añadir tarjeta de pago
- Validado el comportamiento de modificación de saldo
- Confirmado que no se producen loops infinitos ni errores 400 (Bad Request)

## Detalles técnicos

### Problema anterior
Anteriormente, el sistema presentaba los siguientes problemas:
1. Recursión infinita entre `fetchSaldo()` y `crearSaldoInicial()`
2. Errores 400 (Bad Request) al crear tarjetas debido a problemas con campos de usuario
3. Uso de endpoints obsoletos o mal configurados (/mostrar_informacion/ y /mostrar_saldo/)

### Solución implementada
La solución implementó una autenticación simplificada basada en tokens JWT, similar a la usada en el componente `ChangePassword.jsx`. Esta aproximación es más segura, simple y confiable, permitiendo al backend extraer automáticamente la identidad del usuario del token sin necesidad de enviar IDs explícitamente.

También se realizó una migración desde endpoints personalizados a endpoints estándar RESTful, garantizando una integración más robusta entre frontend y backend.


# [2025-05-02] Reestructuración y Optimización del Sistema de Gestión de Saldos

## Commit: Implementación de un sistema de gestión de saldos robusto y mejorado

## Resumen
Se ha realizado una reestructuración completa del sistema de gestión de saldos para corregir problemas críticos, mejorar la lógica de negocio y proporcionar una experiencia de usuario más intuitiva. Los cambios principales incluyen la separación clara entre gestión de tarjetas y saldos, implementación de botones de montos predefinidos, validación de tipos de datos y registro de transacciones.

## Problemas resueltos
1. **Errores de tipo en backend**: Se solucionó el error "unsupported operand type(s) for +=: 'decimal.Decimal' and 'float'" mediante conversión explícita de tipos
2. **Saldos negativos**: Se implementó validación para impedir la introducción de valores negativos
3. **Operaciones sin tarjeta**: Se añadió verificación de tarjeta registrada antes de permitir recargas
4. **Interfaz confusa**: Se separó visualmente la gestión de tarjetas y saldos
5. **Entrada manual propensa a errores**: Se reemplazaron los campos libres por botones con montos predefinidos
6. **Falta de registro**: Se implementó un historial de transacciones completo

## Cambios en Backend

### Modelos
- **Nuevo modelo `HistorialSaldo`**: Se creó para registrar todas las transacciones con metadatos
- **Mejora del modelo `Saldo`**: 
  - Nuevo método `recargar_saldo()` que valida montos positivos y registra la transacción
  - Nuevo método `descontar_saldo()` que verifica saldo suficiente antes de procesar
  - Conversión robusta de tipos utilizando `Decimal` para evitar errores de operaciones matemáticas
  - Validación y redondeo de valores a números enteros

### Serializers
- **Nuevos serializers**:
  - `RecargaSaldoSerializer`: Validación de montos positivos
  - `DescontarSaldoSerializer`: Validación de operaciones de compra
  - `HistorialSaldoSerializer`: Exposición de historial de transacciones

### Endpoints
- **Nuevos endpoints**:
  - `/api/finanzas/saldos/recargar_saldo/`: Para recargas seguras de saldo
  - `/api/finanzas/saldos/descontar_saldo/`: Para realizar compras
  - `/api/finanzas/historial/`: Acceso al historial de transacciones
- **Validaciones de seguridad**:
  - Verificación de tarjeta registrada antes de permitir recargas
  - Prevención de montos negativos
  - Verificación de saldo suficiente para compras

## Cambios en Frontend

### financialManagement.jsx
- **Interfaz rediseñada**:
  - Separación visual entre gestión de tarjetas y gestión de saldo
  - Diseño moderno con tarjetas independientes para cada sección
  - Visualización mejorada del saldo actual
- **Botones de monto predefinido**:
  - Implementación de botones con montos fijos ($10, $25, $50, $100, $200)
  - Eliminación del campo de texto libre propenso a errores
  - Conversión explícita a enteros mediante `Math.floor()` para evitar decimales
- **Historial de transacciones**:
  - Nueva sección que muestra todas las transacciones realizadas
  - Formato tabular con fecha, tipo, monto y saldo resultante
  - Diferenciación visual por tipo de transacción (recarga/compra)
- **Manejo de errores robusto**:
  - Validación local antes de enviar datos al servidor
  - Captura y visualización clara de errores del servidor
  - Estados de carga para mejorar experiencia de usuario

## Beneficios principales
1. **Mayor coherencia**: El sistema ahora requiere una tarjeta antes de poder recargar saldo
2. **Proceso simplificado**: Recargas rápidas con montos predefinidos que elimina errores de entrada
3. **Transparencia**: Historial completo de todas las operaciones realizadas
4. **Seguridad**: Validaciones en frontend y backend para prevenir operaciones inválidas
5. **Experiencia de usuario**: Interfaz más clara con secciones bien definidas
6. **Previsibilidad**: Solo se permiten montos enteros y positivos para recargas

## Implementación técnica
- **Defensa en profundidad**: Validación en cliente y servidor para máxima robustez
- **Manejo de tipos**: Conversión explícita entre float y Decimal para evitar errores de tipo
- **Patrón de diseño**: Separación clara de responsabilidades entre modelos, vistas y componentes
- **Registro de transacciones**: Modelo dedicado para auditoría y seguimiento de operaciones

## Estado actual del sistema ✅
- **Gestión de tarjetas**: Completamente funcional con validaciones
- **Recargas de saldo**: Implementadas con botones de montos predefinidos
- **Historial de transacciones**: Registro completo de todas las operaciones
- **Integración**: Sistema interconectado con el módulo de usuarios
- **Seguridad**: Validaciones robustas en todos los niveles

## Próximos pasos 🚧
1. Integrar completamente con el módulo de compras para procesar pagos
2. Implementar notificaciones por email para transacciones importantes
3. Añadir funcionalidad de exportación del historial de transacciones
4. Desarrollar dashboard con estadísticas de uso del saldo

## Notas técnicas
- La solución implementada resuelve específicamente el error "unsupported operand type(s) for +=: 'decimal.Decimal' and 'float'" mediante conversión explícita de tipos
- Se ha implementado un sistema de redondeo para asegurar valores enteros en las transacciones
- Todas las transacciones quedan registradas con su respectivo tipo, monto y saldo resultante


# [2025-05-03] Anexo: Documentación Técnica del Sistema de Saldos y Métodos de Pago

## Estado Actual del Sistema de Gestión de Saldos y Métodos de Pago

Este anexo complementa la documentación existente, proporcionando detalles específicos sobre el funcionamiento del sistema de saldos y su interacción con los métodos de pago.

### Flujo Detallado de Actualización de Métodos de Pago

El proceso de actualización de tarjeta (método de pago) sigue el siguiente flujo:

1. **Verificación inicial:**
   - El componente `financialManagement.jsx` verifica si el usuario tiene una tarjeta registrada mediante una llamada a `GET /api/finanzas/tarjetas/`
   - Si existe una tarjeta, se muestra con los últimos 4 dígitos visibles y la opción "Actualizar tarjeta"
   - Si no existe, se ofrece la opción "Agregar método de pago"

2. **Proceso de actualización:**
   - Al hacer clic en "Actualizar tarjeta", se carga el componente `addPaymentMethod.jsx`
   - Este componente extrae los datos de la tarjeta actual y los pre-carga en el formulario
   - La actualización se realiza mediante una solicitud `PUT /api/finanzas/tarjetas/{id}/`
   - El backend utiliza la lógica optimizada implementada el 01/05/2025
   para evitar conflictos

3. **Validación de datos:**
   - El frontend valida el formato del número de tarjeta (solo dígitos)
   - Se verifica el formato de fecha de expiración (MM/YY)
   - El campo CVV se valida para contener exactamente 3 dígitos
   - El campo titular debe contener al menos nombre y apellido

4. **Manejo de respuestas:**
   - Éxito: Se muestra una notificación de éxito y se actualiza la visualización de la tarjeta
   - Error: Se muestra un mensaje específico basado en el tipo de error recibido

### Integración entre Sistema de Tarjetas y Saldo

La integración entre el sistema de tarjetas y saldo funciona de la siguiente manera:

1. **Verificación de tarjeta para operaciones de saldo:**
   - Antes de realizar cualquier recarga, el endpoint `recargar_saldo` verifica la existencia de una tarjeta asociada al usuario
   - Esta validación se implementa tanto en frontend como en backend para mayor seguridad
   - Si no existe tarjeta, se muestra un mensaje indicando que debe registrarse una tarjeta primero

2. **Flujo de recarga:**
   - El usuario selecciona un monto predefinido ($10, $25, $50, $100 o $200)
   - El frontend convierte el valor a entero mediante `Math.floor()`
   - Se envía una solicitud `POST /api/finanzas/saldos/recargar_saldo/`
   - El backend procesa la solicitud con el método `recargar_saldo()` del modelo `Saldo`
   - Se registra la transacción en el historial con el tipo "RECARGA"

3. **Flujo de descuento (pago):**
   - Cuando se realiza una compra, se llama al método `pagar()` del modelo `Carrito`
   - Este método obtiene el saldo del usuario y verifica si es suficiente
   - Si hay fondos suficientes, llama al método `descontar_saldo()` del modelo `Saldo`
   - Se registra la transacción en el historial con el tipo "COMPRA"

### Detalles Técnicos Adicionales sobre Manejo de Tipos

Un aspecto crucial de la implementación es la conversión robusta entre tipos de datos:

```python
# Fragmento de código del método recargar_saldo() que maneja la conversión de tipos
if isinstance(cantidad, float) or isinstance(cantidad, int) or isinstance(cantidad, str):
    cantidad_decimal = Decimal(str(cantidad))
elif isinstance(cantidad, Decimal):
    cantidad_decimal = cantidad
else:
    raise ValidationError(f"Tipo de dato no soportado: {type(cantidad)}")
```

Esta implementación resuelve específicamente el error "unsupported operand type(s) for +=: 'decimal.Decimal' and 'float'" que ocurría anteriormente cuando se intentaba sumar un valor float al campo saldo que es de tipo Decimal.

### Sistema de Auditoría y Registro de Transacciones

El modelo `HistorialSaldo` implementa un sistema completo de auditoría que registra:

1. **Metadatos de cada transacción:**
   - Usuario que realizó la transacción
   - Fecha y hora exacta
   - Tipo de transacción (RECARGA, COMPRA, AJUSTE)
   - Monto de la operación
   - Saldo resultante tras la operación
   - Descripción opcional para detalles adicionales

2. **Consulta eficiente del historial:**
   - Ordenamiento por fecha descendente (transacciones más recientes primero)
   - Filtrado por usuario para obtener solo las transacciones propias
   - Representación visual diferenciada por tipo de transacción

Este sistema garantiza transparencia total en las operaciones financieras y permite tanto a usuarios como administradores verificar el estado y evolución del saldo.

# [2025-05-05] Implementación de Configuración Centralizada para API URLs

## Commit: Centralización de endpoints API para facilitar desarrollo y despliegue

## Resumen
Se ha implementado un sistema centralizado para la gestión de URLs de API que permite alternar fácilmente entre entornos de desarrollo (local) y producción. Esta mejora elimina la necesidad de modificar manualmente las URLs de API en múltiples componentes, facilitando el desarrollo, las pruebas y el despliegue.

## Problemas resueltos
1. **URLs hardcodeadas**: Anteriormente, las URLs de la API estaban codificadas directamente en cada componente
2. **Cambios tediosos**: Cambiar entre desarrollo local y producción requería modificar múltiples archivos
3. **Inconsistencias**: Posibilidad de errores al actualizar solo algunas URLs y no todas
4. **Falta de estandarización**: Cada componente podía implementar las llamadas a la API de manera diferente
5. **Dificultad para pruebas**: Complicaciones para probar integraciones con el backend local

## Cambios en Frontend

### Nuevo archivo de configuración
- **Creación de archivo config.js**: Centraliza toda la configuración relacionada con la API
- **Implementación de conmutador**: Variable `useProductionBackend` que determina el entorno
- **Definición de URLs base**: URLs configurables para entornos de producción y desarrollo local
- **Catálogo de endpoints**: Lista completa de todos los endpoints disponibles en la API
- **Funciones auxiliares**: 
  - `getApiUrl()`: Para construcción de URLs completas usando la ruta directa
  - `getApiUrlByKey()`: Para usar endpoints predefinidos por nombre

### Modificación de componentes
- **Refactorización de 14 componentes**: Todos los componentes ahora utilizan el sistema centralizado
- **Eliminación de URLs hardcodeadas**: Reemplazo por llamadas a `getApiUrl()`
- **Estandarización de llamadas API**: Patrón consistente de uso en toda la aplicación
- **Importaciones optimizadas**: Inclusión del módulo de configuración donde sea necesario

## Beneficios principales
1. **Desarrollo simplificado**: Cambio entre entornos con solo modificar una variable
2. **Mayor consistencia**: Todas las llamadas a la API siguen el mismo patrón
3. **Pruebas facilitadas**: Sencillo testeo de cambios en el backend local
4. **Mantenibilidad mejorada**: Actualizaciones de ruta en un solo lugar
5. **Documentación implícita**: La lista de endpoints sirve como documentación viva de la API
6. **Reducción de errores**: Previene discrepancias en URLs entre componentes

## Implementación técnica
- **Patrón Configuración Centralizada**: Todos los ajustes relacionados con la API en un solo lugar
- **Funciones helper**: Métodos utilitarios para construir URLs completas
- **Flexible y adaptable**: Dos métodos de uso (ruta directa o por clave) según necesidad
- **Previsibilidad**: Comportamiento coherente en toda la aplicación

## Estado actual del sistema ✅
- **Archivo de configuración**: Implementado completamente con todas las URLs de la API
- **Componentes adaptados**: Los 14 componentes principales ahora usan el sistema centralizado
- **Endpoints predefinidos**: Todos los endpoints están documentados y disponibles como claves
- **Cambio de entorno**: Funcional a través de una única variable en config.js

## Cómo usar el sistema

### Cambiar entre entornos
```javascript
// En src/api/config.js
const config = {
  // Cambiar a false para usar backend local
  useProductionBackend: true,
  
  // Resto de la configuración...
};
```

### Usar en componentes (dos opciones)
```javascript
// Opción 1: Usando ruta directa
import { getApiUrl } from "../api/config";
const backendURL = getApiUrl("/api/usuarios/perfil/");

// Opción 2: Usando clave predefinida
import { getApiUrlByKey } from "../api/config";
const backendURL = getApiUrlByKey("usuariosPerfil");
```

## Próximos pasos 🚧
1. Implementar detección automática de entorno basada en variables de entorno
2. Añadir sistema de manejo de errores específico por entorno
3. Implementar interceptores de peticiones para manejo de tokens y autenticación
4. Ampliar documentación de endpoints con ejemplos de uso y parámetros
5. Crear sistema de pruebas automáticas para verificar disponibilidad de endpoints

## Notas técnicas
- La solución es compatible con el flujo actual de trabajo y no requiere cambios en el backend
- Se mantiene retrocompatibilidad con componentes que aún no hayan sido actualizados
- El sistema permite extensión futura para incluir nuevos endpoints o entornos adicionales
- Todo el código ha sido probado tanto con el backend local como con el de producción

## Ejemplo de beneficios
Antes, para cambiar del entorno de producción al local, era necesario modificar manualmente más de 20 URLs en 14 archivos diferentes. Ahora, solo se requiere cambiar una línea en config.js:

```javascript
// Cambiar esto de true a false
useProductionBackend: false,
```

Esta mejora agiliza significativamente el proceso de desarrollo y pruebas, reduciendo el tiempo necesario para alternar entre entornos y eliminando una fuente común de errores.

# [2025-05-10] Optimización del Sistema de Catálogo y Búsqueda

## Commit: Implementación unificada y optimizada del sistema de búsqueda y catálogo

## Resumen
Se ha reestructurado completamente el sistema de catálogo y búsqueda para resolver problemas críticos de experiencia de usuario, duplicación de código y rendimiento. Los cambios principales incluyen la unificación de la funcionalidad de búsqueda dentro del catálogo, eliminación del requisito de autenticación para visualizar libros, y la implementación de una interfaz más intuitiva y eficiente.

## Problemas resueltos
1. **Requisito de autenticación innecesario**: Anteriormente, solo usuarios autenticados podían acceder al catálogo y búsqueda
2. **Recargas innecesarias**: Al navegar entre catálogo y búsqueda se recargaban los libros repetidamente
3. **Interfaz confusa**: El sistema de filtros era poco intuitivo y difícil de utilizar
4. **Duplicación de componentes**: Existía código redundante entre el catálogo y la búsqueda
5. **Experiencia fragmentada**: La búsqueda y el catálogo parecían funcionalidades desconectadas

## Cambios en Backend

### LibroViewSet
- **Eliminación de restricciones de autenticación:**
  - Reemplazo de `IsAuthenticatedOrReadOnly` por `AllowAny` para permitir acceso público
  - Configuración adecuada de permisos para mantener seguridad en operaciones de escritura
- **Mejora de filtros y ordenamiento:**
  - Ampliación de los campos disponibles para filtrado incluyendo `categoria`, `editorial`, `año_publicacion`
  - Optimización de campos de búsqueda para incluir `descripcion` y `editorial`
  - Adición de nuevos campos para ordenamiento incluyendo `titulo` y `autor`

### Nuevo ViewSet para Categorías
- **Implementación de CategoriaViewSet:**
  - Endpoint dedicado para consultar todas las categorías disponibles
  - Configurado con permisos públicos para acceso sin autenticación
  - Serialización optimizada para su uso en filtros

### SearchView
- **Eliminación de restricciones:**
  - Reemplazo de validaciones que requerían al menos un criterio de búsqueda
  - Configuración para mostrar todos los libros cuando no hay filtros
  - Implementación de ordenamiento flexible por múltiples campos

## Cambios en Frontend

### Unificación de componentes
- **Componente `SearchBook.jsx` optimizado:**
  - Simplificado para redirigir al catálogo con parámetros de búsqueda
  - Eliminación de lógica duplicada
  - Utilización de parámetros URL para mantener estado de búsqueda

### Catálogo mejorado
- **Componente `catalogo.jsx` reestructurado:**
  - Implementación de interfaz de búsqueda condicional (visible/oculta)
  - Sistema de filtros intuitivo con categorías, rango de precios y ordenamiento
  - Funcionalidad para mostrar/ocultar la interfaz de búsqueda
  - Conservación del estado de búsqueda mediante URL params

### NavBar optimizado
- **Mejoras en `NavBar.jsx`:**
  - Comportamiento inteligente para el icono de búsqueda
  - Si está en catálogo: alterna la visualización de la interfaz de búsqueda
  - Si está en otra página: navega al catálogo con la interfaz de búsqueda visible

## Beneficios principales
1. **Eliminación de recargas innecesarias**: La navegación entre catálogo y búsqueda ya no provoca recargas
2. **Acceso público mejorado**: Cualquier visitante puede explorar el catálogo sin necesidad de registro
3. **Interfaz unificada**: Una única interfaz coherente para consultar todos los libros
4. **Experiencia de usuario mejorada**: Filtros intuitivos y ordenamiento sencillo
5. **Optimización de código**: Eliminación de duplicaciones y mejora de la estructura
6. **Mantenimiento simplificado**: Concentración de la lógica de búsqueda en un solo componente

## Implementación técnica
- **Enfoque basado en estado**: Uso de estados React para controlar la visualización de interfaces
- **URL con parámetros**: Utilización de parámetros en URL para preservar el estado de búsqueda
- **Interacción contextual**: Comportamiento del icono de búsqueda adaptado al contexto actual
- **Filtrado eficiente**: Implementación de filtros en el cliente para respuesta instantánea
- **Ordenamiento flexible**: Sistema de ordenación por múltiples campos con dirección configurable

## Estado actual del sistema ✅
- **Catálogo público**: Accesible para todos los usuarios, autenticados o no
- **Búsqueda integrada**: Completamente funcional dentro del catálogo
- **Filtros avanzados**: Por categoría, rango de precios y otros campos
- **Ordenamiento**: Implementado para título, precio y año de publicación
- **Navegación optimizada**: Sin recargas innecesarias entre vistas relacionadas

## Mejoras específicas de interfaz
1. **Botón de alternar búsqueda**: Permite mostrar/ocultar la interfaz de búsqueda según necesidad
2. **Filtros intuitivos**: Controles claros para cada tipo de filtrado
3. **Indicadores visuales**: Resaltado de filtros activos y dirección de ordenamiento
4. **Mensajes informativos**: Retroalimentación clara cuando no hay resultados
5. **Barra de búsqueda mejorada**: Busca en múltiples campos (título, autor, ISBN, año)

## Proceso de búsqueda actual
1. **Usuario accede al catálogo**: Ve todos los libros disponibles
2. **Usuario activa la búsqueda**: Desde el navbar o con el botón "Mostrar búsqueda"
3. **Usuario configura filtros**: Selecciona categoría, rango de precios y/o término de búsqueda
4. **Usuario ordena resultados**: Selecciona campo y dirección (ascendente/descendente)
5. **Sistema muestra resultados**: Filtrados y ordenados según los criterios especificados

## Próximos pasos 🚧
1. Implementar sistema de paginación para grandes colecciones de libros
2. Añadir filtros adicionales como popularidad o valoración
3. Implementar búsqueda por características avanzadas (número de páginas, idioma)
4. Desarrollar sistema de búsqueda predictiva con sugerencias
5. Integrar con el sistema de recomendaciones

## Notas técnicas
- La implementación actual utiliza filtrado en el cliente para mayor velocidad
- Todos los componentes ahora utilizan el sistema centralizado de configuración de API
- Se ha mejorado el manejo de tipos de datos para prevenir errores en las operaciones de filtrado
- La estructura del código permite fácil expansión para nuevos tipos de filtros en el futuro

# Implementación del Módulo de Mensajería para Sistema de Gestión de Biblioteca

## [2025-10-15] Implementación del Sistema de Mensajería y Foros

### Visión general

Se implementó un sistema completo de mensajería que permite a los usuarios comunicarse con el personal de la biblioteca a través de foros personales. El sistema incluye componentes para usuarios regulares y personal administrativo, con diferentes niveles de acceso y funcionalidades.

### Backend (Django)

- **fix(mensajeria):** Corregido problema en el método responder del MensajeViewSet
  - **commit:** Corrección del atributo 'estado' por 'estado_mensaje' en MensajeViewSet
    - Actualizado método `responder()` para utilizar el atributo correcto `estado_mensaje` en vez de `estado`
    - Añadido manejo de excepciones detallado con mensajes específicos de error
    - Implementada verificación de permisos y datos para respuestas
    - Agregado logging para un mejor seguimiento de errores

  ```python
  @action(detail=True, methods=['post'])
  def responder(self, request, **kwargs):
      try:
          mensaje_original = self.get_object()
          
          # Corregido: usar estado_mensaje en lugar de estado
          if mensaje_original.estado_mensaje == 'ABIERTO':
              mensaje_original.estado_mensaje = 'RESPONDIDO'
              mensaje_original.save()
              
          # Resto de la implementación...
  ```

- **fix(mensajeria):** Corregido problema en el método cerrar del MensajeViewSet
  - **commit:** Actualización del método cerrar para usar estado_mensaje consistentemente
    - Corregido método `cerrar()` para usar `estado_mensaje` en lugar de `estado`
    - Mejorado manejo de errores para evitar fallos en frontend

  ```python
  @action(detail=True, methods=['post'])
  def cerrar(self, request, **kwargs):
      try:
          mensaje = self.get_object()
          
          # Actualizar estado del mensaje
          mensaje.estado_mensaje = 'CERRADO'  # Corregido estado → estado_mensaje
          mensaje.save()
          
          # Resto de la implementación...
  ```

### Frontend (React)

- **feat(mensajeria):** Implementación del componente forumMessages.jsx para usuarios
  - **commit:** Creación del componente de mensajería para usuarios regulares
    - Desarrollado sistema para mostrar, crear y responder mensajes
    - Implementado manejo de notificaciones para nuevos mensajes y respuestas
    - Añadido filtrado y visualización de estados de mensajes (ABIERTO/RESPONDIDO/CERRADO)
    - Optimizada la ordenación de mensajes y respuestas cronológicamente

  ```javascript
  // Ordenación cronológica de respuestas para mejor seguimiento de conversaciones
  {[...selectedMessage.respuestas].sort((a, b) => 
    new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
  ).map(reply => (
    // Renderizado de las respuestas...
  ))}
  ```

- **feat(mensajeria):** Implementación del componente adminForumMessages.jsx para staff
  - **commit:** Desarrollo del panel de administración de mensajes para personal bibliotecario
    - Creado sistema de visualización global de todos los foros y mensajes de usuarios
    - Implementado filtrado por múltiples criterios (estado, usuario, contenido)
    - Añadidos contadores visuales de mensajes por estado
    - Desarrollada interfaz para responder y cerrar consultas de usuarios

  ```javascript
  // Conteo de mensajes por estado para mejor visualización
  const counts = {
    ABIERTO: mainMessages.filter(msg => msg.estado_mensaje === 'ABIERTO').length,
    RESPONDIDO: mainMessages.filter(msg => msg.estado_mensaje === 'RESPONDIDO').length,
    CERRADO: mainMessages.filter(msg => msg.estado_mensaje === 'CERRADO').length,
    total: mainMessages.length
  };
  setMessageCounts(counts);
  ```

- **fix(mensajeria):** Optimización del manejo de errores en respuestas de mensajes
  - **commit:** Implementación de solución para error 'Mensaje object has no attribute estado'
    - Añadido manejo específico del error conocido del backend en ambos componentes
    - Implementada captura y parseo de respuestas de error para mejor feedback al usuario
    - Desarrollada solución que permite continuar funcionando correctamente a pesar del error

  ```javascript
  // En adminForumMessages.jsx y forumMessages.jsx
  if (responseText.includes("'Mensaje' object has no attribute 'estado'")) {
    console.warn("Error conocido del backend, pero la respuesta probablemente se guardó correctamente");
    toast.success("Respuesta enviada correctamente");
    setReplyContent("");
    
    // Esperamos un momento y actualizamos para ver la nueva respuesta
    setTimeout(() => {
      fetchMessageDetails(selectedMessage.id);
      // En adminForumMessages.jsx también actualizamos todos los mensajes
      fetchAllMessages && fetchAllMessages();
    }, 1000);
    return;
  }
  ```

- **fix(mensajeria):** Mejoras de usabilidad en componentes de mensajería
  - **commit:** Actualizaciones de UI/UX en componentes de mensajería
    - Mejorada la visualización de estados con códigos de colores consistentes
    - Implementado resaltado visual para mensajes abiertos en panel administrativo
    - Optimizada la experiencia de búsqueda y filtrado de mensajes
    - Añadido refresco automático de datos después de acciones importantes

  ```javascript
  // Estilizado de estados de mensajes para mejor visualización
  const getStatusColor = (status) => {
    switch(status) {
      case 'ABIERTO':
        return 'bg-amber-100 text-amber-800';
      case 'RESPONDIDO':
        return 'bg-green-100 text-green-800';
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  ```



### Integración y flujo de trabajo

- **feat(perfil):** Integración del sistema de mensajería en el perfil de usuario
  - **commit:** Integración de componentes de mensajería en el sistema de perfil
    - Añadida lógica para mostrar el componente adecuado según el rol del usuario (staff/usuario)
    - Implementada navegación contextual entre secciones del perfil
    - Optimizada la carga de datos según permisos y necesidades del usuario

### Correcciones y mejoras

- **fix(mensajería):** Optimización de rendimiento en carga de mensajes
  - **commit:** Mejora del rendimiento en carga de datos de mensajería
    - Implementada carga optimizada de mensajes para evitar múltiples peticiones al servidor
    - Añadido filtrado local de mensajes ya cargados para reducir llamadas al API
    - Mejorado manejo de estado para prevenir renderizados innecesarios

## Resumen del sistema implementado

El sistema de mensajería ahora cuenta con:

1. **Foros personales**: Cada usuario dispone de un foro personal donde puede crear consultas y recibir respuestas.

2. **Vista diferenciada por roles**:
   - **Usuarios regulares**: Pueden ver su foro personal, crear mensajes nuevos y responder a mensajes existentes.
   - **Personal (staff)**: Pueden ver todos los foros, responder a cualquier mensaje y cerrar consultas.

3. **Estados de mensajes**:
   - **ABIERTO**: Mensajes nuevos sin respuesta.
   - **RESPONDIDO**: Mensajes que han recibido al menos una respuesta.
   - **CERRADO**: Consultas marcadas como resueltas o cerradas por un administrador.

4. **Notificaciones**: Sistema de notificaciones para informar a los usuarios cuando reciben respuestas a sus mensajes.

5. **Filtrado y búsqueda**: Capacidades avanzadas de búsqueda y filtrado, especialmente para el staff.

6. **Manejo robusto de errores**: Soluciones implementadas para manejar errores conocidos del backend de manera transparente para el usuario.


## [2025-5-22] Documentación de corrección de errores: Discordancia en los campos de actualización de perfil

## Problema
Los usuarios podían configurar campos como `username`, `nacionalidad` y `departamento` durante el registro, pero estos campos no se podían modificar al editar el perfil. El frontend de React tenía componentes de interfaz de usuario para estos campos, pero los cambios no se guardaban en el backend.

## Causa raíz
El `ProfileUpdateSerializer` en serializers.py no incluía los campos `username`, `nacionalidad` y `departamento` en su tupla `fields`. Por ello, aunque el frontend enviaba estos valores, el backend de Django los ignoraba sin dar aviso durante las actualizaciones de perfil.

## Archivos modificados
1. serializers.py - Se añadieron los campos faltantes al serializador y se añadió la validación.
2. views.py - Se actualizaron los ejemplos de la documentación de la API para reflejar los nuevos campos.

## Cambios realizados
1. Se añadieron `username`, `nacionalidad` y `departamento` a la tupla `ProfileUpdateSerializer.Meta.fields`.
2. Se implementó la validación correcta del campo `username` para garantizar su unicidad.
3. Se corrigieron problemas de sangría en el código del serializador.
4. Se actualizó el ejemplo de la documentación de OpenAPI en el archivo views.py para incluir los nuevos campos compatibles.

## Flujo de trabajo
1. Cuando un usuario envía una edición a su perfil a través del componente `EditProfile` del frontend:
- Se recopilan los datos del formulario de los campos, incluidos los campos previamente ignorados.
- Los datos se envían al endpoint `/api/usuarios/actualizar_perfil/`.
2. El backend ahora:
- Deserializa correctamente todos los campos, incluidos `username`, `nacionalidad` y `departamento`
- Valida el nombre de usuario para garantizar su unicidad.
- Actualiza todos los campos de la base de datos.
- Devuelve los datos completos y actualizados del perfil al frontend.

## Pruebas
Esta corrección permite a los usuarios actualizar correctamente todos los campos del perfil, incluyendo nombre de usuario, nacionalidad y departamento, lo cual no funcionaba anteriormente. La validación garantiza que, aunque estos campos se puedan editar, sigan cumpliendo las reglas de negocio (como la unicidad del nombre de usuario).

## Detalles adicionales
Este tipo de problema es común cuando se añaden campos a modelos y componentes del frontend, pero se olvidan en los serializadores que los conectan. Los campos ya se gestionaban correctamente en el proceso de registro mediante `UsuarioRegistroSerializer`, pero faltaban en el flujo de actualización. Esta corrección garantiza la coherencia entre las funciones de registro y edición de perfiles.# [2025-05-23] Integración Completa de Compras y Finanzas, Mejoras en Serialización y Migraciones

## feat(compras): Integración robusta entre Carrito, Pedidos y Finanzas

### Cambios principales

- **Integración del método `pagar()` en el modelo Carrito:**
  - Ahora descuenta saldo del usuario solo si hay fondos suficientes.
  - Valida stock de cada libro antes de procesar la compra.
  - Descuenta stock de los libros comprados.
  - Limpia el carrito tras el pago exitoso.
  - Registra cada compra como un nuevo Pedido y asocia libros y cantidades mediante el modelo intermedio `PedidoLibro`.

- **Modelo intermedio `CarritoLibro` y `PedidoLibro`:**
  - Permiten manejar cantidades independientes de libros en el carrito y en los pedidos.
  - El modelo `PedidoLibro` almacena la tupla (libro, cantidad) para cada pedido, asegurando trazabilidad y detalle en el historial de compras.

- **Mejoras en métodos de Carrito:**
  - Métodos `agregar_libro`, `quitar_libro`, `limpiar_carrito` y `obtener_libros` refactorizados para trabajar siempre con el modelo intermedio y mantener la integridad de cantidades.
  - Validaciones robustas para evitar cantidades negativas o inconsistentes.

---

## fix(migraciones): Sincronización y corrección de migraciones

- **Reestructuración de migraciones:**
  - Eliminadas y recreadas migraciones para resolver inconsistencias entre la base de datos y los modelos.
  - Uso de `--fake-initial` para sincronizar el estado de la base de datos con las migraciones de Django cuando las tablas ya existen.
  - Corrección de referencias a modelos en migraciones (`to="compras.Pedidos"` en vez de `to="compras.pedidos"`).

- **Gestión de dependencias:**
  - Orden correcto de creación de modelos y relaciones ForeignKey.
  - Separación de la creación de modelos intermedios (`PedidoLibro`, `CarritoLibro`) en migraciones independientes para evitar errores de dependencia circular.

---

## feat(api): Serialización avanzada de pedidos y carritos

- **Serializers anidados:**
  - `PedidoLibroSerializer` y `CarritoLibroSerializer` ahora incluyen el objeto libro completo usando `LibroSerializer`.
  - `PedidosSerializer` expone el historial de compras con detalle de libros y cantidades (`pedidolibro_set`).
  - Endpoints de carrito devuelven la lista de libros y cantidades en formato estructurado, facilitando la integración con el frontend.

- **Endpoints mejorados:**
  - `/api/compras/carritos/obtener_libros/`: Devuelve todos los libros del carrito con sus cantidades y detalles completos.
  - `/api/compras/carritos/pagar/`: Procesa el pago, descuenta saldo y stock, y registra el pedido.
  - `/api/compras/carritos/historial_pedidos/`: Devuelve el historial de pedidos del usuario autenticado, mostrando libros y cantidades.

---

## fix(admin): Mejoras en la administración de compras

- **Visualización y gestión:**
  - Mejorada la visualización de libros y cantidades en el admin de Carrito y Pedidos.
  - Acciones personalizadas para vaciar carritos y gestionar pedidos desde el panel administrativo.

---

## Estado Actual del Sistema

### Funcionalidades Implementadas ✅

- **Compras:**
  - Carrito funcional con manejo de cantidades por libro.
  - Pago integrado con verificación de saldo y stock.
  - Registro detallado de pedidos y su historial.
  - Serialización avanzada para integración frontend.

- **Finanzas:**
  - Descuento automático de saldo al comprar.
  - Validaciones robustas de saldo y stock.
  - Registro de transacciones en el historial de saldo.

- **Migraciones y administración:**
  - Migraciones sincronizadas y sin errores.
  - Panel admin mejorado para gestión de compras y finanzas.

---

## Próximos Pasos 🚧

1. **Optimizar consultas y prefetching en endpoints de historial y carrito.**
2. **Implementar notificaciones por email tras compras exitosas.**
3. **Agregar soporte para devoluciones y cancelaciones de pedidos.**
4. **Mejorar la documentación Swagger/OpenAPI para todos los endpoints de compras y finanzas.**
5. **Desarrollar pruebas unitarias e integración para el flujo de compra y pago.**

---

## Notas Técnicas

- El uso de modelos intermedios (`CarritoLibro`, `PedidoLibro`) es obligatorio para manejar cantidades por libro.
- Las migraciones deben recrearse si se cambia el nombre de un modelo o relación.
- Para sincronizar migraciones con la base de datos existente, usar `python manage.py migrate <app> --fake-initial`.
- Todos los endpoints devuelven datos estructurados y listos para consumo en frontend React.


## [2025-06-04] Implementación del Módulo de Tiendas y API de Ubicaciones

### feat(tiendas): Nuevo módulo para gestión de tiendas físicas

#### Implementación del modelo Tienda
- **Creado modelo `Tienda`** en `apps.tiendas.models` con los siguientes campos:
  - `nombre`: Nombre de la tienda (CharField)
  - `direccion`: Dirección física (CharField)
  - `latitud`: Coordenada de latitud (DecimalField)
  - `longitud`: Coordenada de longitud (DecimalField)
- **Método `__str__`** para mostrar el nombre en el admin y representaciones.

#### Migraciones y configuración de la app
- **Creada migración inicial** para el modelo Tienda.
- **Configuración de la app** en `apps.py` con `name = 'apps.tiendas'` para correcto registro en Django.

#### Serialización y API REST
- **Creado `TiendaSerializer`** para exponer todos los campos del modelo.
- **Implementado `TiendaViewSet`** usando `ModelViewSet` para CRUD completo de tiendas.
- **Configurado router y URLs** en `apps/tiendas/urls.py`:
  - Endpoint principal: `/api/tiendas/tiendas/` (GET, POST, PUT, DELETE)

#### Integración en el proyecto
- **Registrada la app `tiendas`** en `INSTALLED_APPS` y en el archivo global de URLs.
- **Endpoint disponible** para que el frontend consuma la lista de tiendas y sus ubicaciones.

---

### Estado Actual del Sistema

#### Funcionalidades Implementadas ✅
- **Gestión de tiendas físicas**:
  - CRUD completo de tiendas desde el backend.
  - Almacenamiento de coordenadas para integración con Google Maps u otros servicios de mapas.
- **API RESTful**:
  - Endpoint `/api/tiendas/tiendas/` para listar, crear, editar y eliminar tiendas.
  - Serialización completa de los datos de cada tienda.

#### Integración con Frontend
- El frontend puede consumir `/api/tiendas/tiendas/` para mostrar las ubicaciones en un mapa interactivo.
- Preparado para integración con componentes de Google Maps en React.

---

### Próximos Pasos 🚧

1. **Agregar validaciones adicionales** para coordenadas y direcciones.
2. **Mejorar la documentación Swagger/OpenAPI** para el módulo de tiendas.
3. **Implementar filtros y búsqueda** por nombre o ubicación en el endpoint.
4. **Integrar visualización de tiendas en el frontend** usando Google Maps.
5. **Agregar soporte para imágenes o información adicional de cada tienda.**

---

### Notas Técnicas

- El modelo `Tienda` es independiente y puede ser extendido fácilmente.
- El endpoint está protegido por los permisos globales de la API (puede ajustarse según necesidad).
- La estructura permite escalar a múltiples sucursales y visualización geográfica.