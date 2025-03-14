# Sistema de Gestión de Librería

## Descripción General

Este proyecto implementa un sistema completo de gestión para una librería, con funcionalidades que incluyen:

- Administración de Libros
- Gestión de Usuarios
- Compras y Reservas
- Noticias
- Búsqueda
- Mensajería
- Recomendaciones

## Estructura del Proyecto

- `backend/`: API REST desarrollada con Django y Django REST Framework
- `frontend/`: Interfaz de usuario desarrollada con Next.js

## Requisitos del Sistema

### Backend
- Python 3.8+
- Virtualenv
- Dependencias: [backend/requirements.txt](cci:7://file:///f:/Universidad/Lab%20Software/Proyecto-Libreria/backend/requirements.txt:0:0-0:0)

### Frontend
- Node.js 18+
- npm o yarn

## Configuración del Entorno de Desarrollo

### Instalación Inicial

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/tu-usuario/proyecto-libreria.git
   cd proyecto-libreria
   ```

2. **Configurar Backend**
   ```bash
   # Crear entorno virtual
   cd backend
   python -m venv venv
   source venv/bin/activate  # Unix
   venv\Scripts\activate     # Windows

   # Instalar dependencias
   pip install -r requirements.txt
   ```

3. **Configurar Base de Datos**
   ```bash
   # Aplicar migraciones
   python manage.py migrate

   # Crear superusuario
   python manage.py createsuperuser

   # Cargar Datos de Prueba (Opcional)
   python manage.py loaddata usuarios_prueba.json
   python manage.py loaddata libros_prueba.json

   # Iniciar Servidor de Desarrollo
   python manage.py runserver
   ```

4. **Configurar Frontend**
   ```bash
   cd ../frontend

   # Instalar Dependencias
   npm install

   # Iniciar Servidor de Desarrollo
   npm run dev
   ```

## Comandos Útiles de Django

### Gestión de Base de Datos

#### Migraciones
```bash
# Crear migraciones
python manage.py makemigrations usuarios
python manage.py makemigrations libros
python manage.py makemigrations busqueda 
python manage.py makemigrations noticias
python manage.py makemigrations mensajeria

# Aplicar migraciones
python manage.py migrate
```

#### Gestión de Datos
```bash
# Cargar fixtures
python manage.py loaddata usuarios_prueba.json

# Crear backup de datos
python manage.py dumpdata usuarios > usuarios_backup.json
```

### Gestión de Usuarios
```bash
# Crear superusuario
python manage.py createsuperuser

# Cambiar contraseña
python manage.py changepassword <username>
```

## Pruebas del Backend

### Verificación de Endpoints

1. **Documentación de la API**
   - Swagger UI: [https://proyecto-libreria-k9xr.onrender.com/api/schema/swagger-ui/](https://proyecto-libreria-k9xr.onrender.com/api/schema/swagger-ui/)
   - ReDoc: [https://proyecto-libreria-k9xr.onrender.com/api/schema/redoc/](https://proyecto-libreria-k9xr.onrender.com/api/schema/redoc/)

2. **Endpoints Principales**
   ```bash
   # Endpoints de Libros
   curl -X GET https://proyecto-libreria-k9xr.onrender.com/api/libros/
   
   # Endpoints de Usuarios
   curl -X GET https://proyecto-libreria-k9xr.onrender.com/api/usuarios/
   ```

## Guías Prácticas de Desarrollo Local

### Autenticación y Autorización

#### Obtención de Token JWT
1. **Usando el navegador:**
   - Accede a `http://127.0.0.1:8000/api/token/`
   - Usa el formulario para ingresar credenciales
   - Obtendrás un token de acceso y uno de refresco

2. **Usando Postman:**
   - Método: POST
   - URL: `http://127.0.0.1:8000/api/token/`
   - Body (raw JSON):
     ```json
     {
         "username": "tu_usuario",
         "password": "tu_contraseña"
     }
     ```

#### Uso de Token en Swagger
1. En la interfaz de Swagger (`/api/schema/swagger-ui/`)
2. Haz clic en el botón "Authorize" (ícono de candado)
3. Ingresa el token en formato: `Bearer tu_token_aquí`
4. Haz clic en "Authorize"

### Comandos Django Útiles

#### Gestión de Migraciones
```bash
# Crear migraciones para una app específica
python manage.py makemigrations nombre_app

# Crear migraciones para todas las apps
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ver estado de migraciones
python manage.py showmigrations
```

#### Gestión de Datos
```bash
# Crear superusuario
python manage.py createsuperuser

# Cargar datos de prueba
python manage.py loaddata nombre_fixture.json

# Crear backup de datos
python manage.py dumpdata nombre_app > backup.json
```

#### Desarrollo y Depuración
```bash
# Iniciar servidor con modo debug
python manage.py runserver

# Iniciar shell de Django
python manage.py shell

# Limpiar archivos .pyc
python manage.py clean_pyc

# Verificar problemas en el proyecto
python manage.py check
```

### Trucos y Consejos

#### Manejo de Entorno Virtual
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
.\venv\Scripts\activate

# Desactivar entorno virtual
deactivate
```

#### Instalación de Dependencias
```bash
# Instalar desde requirements.txt
pip install -r requirements.txt

# Actualizar requirements.txt
pip freeze > requirements.txt
```


### Accesos Directos Importantes

#### URLs de Desarrollo
- Admin: `http://127.0.0.1:8000/admin/`
- API Root: `http://127.0.0.1:8000/api/`
- Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- ReDoc: `http://127.0.0.1:8000/api/schema/redoc/`

#### Endpoints Principales
- Autenticación:
  - Token: `/api/token/`
  - Refresh Token: `/api/token/refresh/`
- Libros: `/api/libros/`
- Búsqueda: `/api/search/`
- Usuarios: `/api/usuarios/`

### Solución de Problemas Comunes

#### Base de Datos
```bash
# Si hay problemas con las migraciones
python manage.py migrate --run-syncdb

# Para resetear la base de datos
python manage.py flush
```

#### Cache y Archivos Estáticos
```bash
# Limpiar cache
python manage.py clearcache

# Recolectar archivos estáticos
python manage.py collectstatic
```

#### Permisos y Usuarios
```bash
# Cambiar contraseña de usuario
python manage.py changepassword username

# Crear usuario con permisos específicos
python manage.py createsuperuser
```

### Herramientas Recomendadas

1. **Postman:**
   - Para probar endpoints
   - Crear colecciones de pruebas
   - Manejar autenticación JWT

2. **DBeaver:**
   - Para gestionar base de datos PostgreSQL
   - Visualizar y modificar datos

3. **Git Bash:**
   - Para usar comandos git en Windows
   - Mejor que CMD para desarrollo

### Recursos Adicionales

- [Documentación de Django](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL en Windows](https://www.postgresql.org/download/windows/)
- [Python en Windows](https://www.python.org/downloads/windows/)