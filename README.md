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