#!/bin/bash

# Obtener la ruta absoluta del directorio actual
current_directory=$(dirname "$(readlink -f "$0")")

# Ejecutar el comando en el directorio actual
cd "$current_directory" && yarn run dev