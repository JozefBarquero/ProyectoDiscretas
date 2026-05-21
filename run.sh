#!/bin/bash

cd "$(dirname "$0")"

cleanup() {
    echo "Apagando servidores..."
    pkill -f "node server.js"
    exit
}

trap cleanup SIGINT

cd servidor-ranking

echo "Iniciando servidor Node..."

konsole --hold -e node server.js &

NODE_TERM_PID=$!

echo "Servidor corriendo en http://localhost:3000"
echo "Ctrl + C para salir."

wait