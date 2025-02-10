# Sistema de Gestión de Librería

Este proyecto implementa un sistema completo de gestión para una librería, con funcionalidades que incluyen administración de libros, gestión de usuarios, compras, noticias, búsqueda, mensajería y recomendaciones.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `backend/`: API REST desarrollada con Django y Django REST Framework
- `frontend/`: Interfaz de usuario desarrollada con Next.js

## Requisitos

### Backend
- Python 3.8+
- Virtualenv o similar
- Dependencias listadas en `backend/requirements.txt`

### Frontend
- Node.js 18+
- npm o yarn

## Configuración del Entorno de Desarrollo

### Backend

1. Crear y activar entorno virtual:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Aplicar migraciones:
```bash
python manage.py migrate
```

4. Crear superusuario:
```bash
python manage.py createsuperuser
```

5. Ejecutar servidor de desarrollo:
```bash
python manage.py runserver
```

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Ejecutar servidor de desarrollo:
```bash
npm run dev
```

## Estructura de Módulos

El sistema está organizado en los siguientes módulos:

- Administración de Libros
- Compra y Reserva de Libros
- Gestión de Usuarios
- Noticias
- Búsqueda
- Gestión Financiera
- Mensajería
- Recomendaciones

## Documentación

La documentación de la API está disponible en `/api/schema/swagger-ui/` cuando el servidor está en ejecución.
