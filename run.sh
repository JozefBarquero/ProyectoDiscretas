#!/bin/bash

cd "$(dirname "$0")"

cleanup() {
    echo "Apagando servidores..."
    pkill -f "python3 -m http.server 8000"
    pkill -f "node server.js"
    exit
}

trap cleanup SIGINT

konsole --hold -e python3 -m http.server 8000 &
PYTHON_TERM_PID=$!

cd servidor-ranking

konsole --hold -e node server.js &
NODE_TERM_PID=$!

echo "Todo corriendo en ventanas separadas. Ctrl + C para salir."

wait
