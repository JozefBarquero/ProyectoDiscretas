#!/bin/bash

cd "$(dirname "$0")"

cleanup() {
    echo "Apagando servidores..."
    kill $PYTHON_PID $NODE_PID
    exit
}

trap cleanup SIGINT

python3 -m http.server 8000 &
PYTHON_PID=$!

cd servidor-ranking
node server.js &
NODE_PID=$!

echo "Todo corriendo. Ctrl + C para salir."

wait
