const API_URL = "/api";

let gameState = {
    playerName: "",
    score: 0,
    currentExpression: "",
    currentTokens: [],
    expectedAnswer: "",
    typeAsked: "" 
};

function generateRandomExpression() {
   
    const operators = ['+', '-', '*', '/', '^']; 
    
    const getRandomNum = () => Math.floor(Math.random() * 9) + 1; // 1 a 9
    const getRandomOp = () => operators[Math.floor(Math.random() * operators.length)];

  
    const randomDifficulty = Math.floor(Math.random() * 4);

    if (randomDifficulty === 0) {
        return `${getRandomNum()} ${getRandomOp()} ${getRandomNum()}`;
    } else if (randomDifficulty === 1) {
        return `${getRandomNum()} ${getRandomOp()} ${getRandomNum()} ${getRandomOp()} ${getRandomNum()}`;
    } else if (randomDifficulty === 2) {
        const op1 = getRandomOp();
        const op2 = getRandomOp();
        return `( ${getRandomNum()} ${op1} ${getRandomNum()} ) ${op2} ${getRandomNum()}`;
    } else {
        const op1 = getRandomOp();
        const op2 = getRandomOp();
        const op3 = getRandomOp();
        return `( ( ${getRandomNum()} ${op1} ${getRandomNum()} ) ${op2} ${getRandomNum()} ) ${op3} ${getRandomNum()}`;
    }
}

function nextChallenge() {
    document.getElementById('game-answer').value = "";

    const expr = generateRandomExpression();
    gameState.currentExpression = expr;
    gameState.currentTokens = tokenize(expr);
    
    
    const postfix = infixToPostfix(gameState.currentTokens);
    const prefix = infixToPrefix(gameState.currentTokens);
    const root = buildTree(postfix);
    
    
    const askType = Math.floor(Math.random() * 3);
    
    if (askType === 0) {
        gameState.typeAsked = "prefix";
        document.getElementById('game-question-label').innerHTML = `<strong>Preorden (Prefija):</strong>`;
        gameState.expectedAnswer = prefix.join(' ').trim();
    } else if (askType === 1) {
        gameState.typeAsked = "postfix";
        document.getElementById('game-question-label').innerHTML = `<strong>Postorden (Postfija):</strong>`;
        gameState.expectedAnswer = postfix.join(' ').trim();
    } else {
        gameState.typeAsked = "inorder";
        document.getElementById('game-question-label').innerHTML = `<strong>Entreorden (Infija):</strong>`;
        gameState.expectedAnswer = getEntreorden(root).join(' ').trim();
    }
    
    document.getElementById('game-expression').innerText = expr;
}
function startGame() {
    const nameInput = document.getElementById('player-name').value.trim();
    if (!nameInput) {
        alert("Por favor, ingresa un apodo para registrar tus puntos.");
        return;
    }
    
    gameState.playerName = nameInput;
    gameState.score = 0;
    
    document.getElementById('game-player-display').innerText = gameState.playerName;
    document.getElementById('game-score').innerText = gameState.score;
    
    document.getElementById('game-setup').classList.add('hidden-section');
    document.getElementById('game-play').classList.remove('hidden-section');
    document.getElementById('game-over').classList.add('hidden-section');
    
    nextChallenge();
}

function submitAnswer() {
    const userAnswer = document.getElementById('game-answer').value.trim().replace(/\s+/g, ' '); 
    const correctAnswer = gameState.expectedAnswer;
    
    if (userAnswer === correctAnswer) {
        gameState.score++;
        document.getElementById('game-score').innerText = gameState.score;
        alert("¡Correcto! +1 punto 🎉");
        nextChallenge();
    } else {
        gameOver();
    }
}

function gameOver() {
    document.getElementById('game-play').classList.add('hidden-section');
    document.getElementById('game-over').classList.remove('hidden-section');
    document.getElementById('game-final-score').innerText = gameState.score;
    
    saveScore(gameState.playerName, gameState.score);
}

function resetGameView() {
    document.getElementById('game-over').classList.add('hidden-section');
    document.getElementById('game-setup').classList.remove('hidden-section');
    document.getElementById('player-name').value = "";
}

function saveScore(nombre, puntos) {
    fetch(`${API_URL}/ranking`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, puntos })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Puntaje guardado con éxito", data);
        fetchRanking(); 
    })
    .catch(err => {
        console.error("Error guardando puntaje:", err);
    });
}

function fetchRanking() {
    fetch(`${API_URL}/ranking`)
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById('ranking-body');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">Aún no hay puntuaciones guardadas. ¡Sé el primero!</td></tr>`;
            return;
        }

        data.forEach((row, index) => {
            let medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`;
            tbody.innerHTML += `
                <tr>
                    <td style="font-weight: bold;">${medal}</td>
                    <td>${row.nombre}</td>
                    <td style="font-weight: bold; color: #a855f7;">${row.puntos}</td>
                    <td style="font-size: 0.85em; color: #64748b;">${row.fecha}</td>
                </tr>
            `;
        });
    })
    .catch(err => {
        console.error("Error al obtener ranking:", err);
        const tbody = document.getElementById('ranking-body');
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444;">No se pudo conectar al servidor de base de datos.</td></tr>`;
    });
}