#!/bin/bash

# Migrar la base de datos
python manage.py migrate

# Cargar datos de prueba
python manage.py loaddata usuarios_prueba.json
