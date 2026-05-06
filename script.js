// Interfaz
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');



// menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});




// navegacion
function showSection(sectionId) {
    if (window.event) {
        window.event.preventDefault();
    }

    document.getElementById('calculator').classList.add('hidden-section');
    document.getElementById('exercises').classList.add('hidden-section');
    document.getElementById('game').classList.add('hidden-section');
    
    document.getElementById('calculator').classList.remove('active-section');
    document.getElementById('exercises').classList.remove('active-section');
    document.getElementById('game').classList.remove('active-section');

    document.getElementById(sectionId).classList.remove('hidden-section');
    document.getElementById(sectionId).classList.add('active-section');
    navLinks.classList.remove('active'); // Cierra el menú en móviles

    if(sectionId === 'game') {
        fetchRanking();
    }
}



// respuestas btn
function toggleAnswer(ansId) {
    const el = document.getElementById(ansId);
    el.classList.toggle('hidden-answer');
}




// logica



// separa numeros de simb
function tokenize(expr) {
    return expr.match(/\d+|\+|\-|\*|\/|\(|\)/g) || [];
}

const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };




// inorden a Postorden 
function infixToPostfix(tokens) {
    let output = [];
    let stack = [];

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(token); 
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); 
        } else { 
            while (stack.length && precedence[stack[stack.length - 1]] >= precedence[token]) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }
    while (stack.length) output.push(stack.pop());
    return output;
}




// inorden a preorden
function infixToPrefix(tokens) {
    let reversed = [...tokens].reverse().map(t => t === '(' ? ')' : t === ')' ? '(' : t);
    let postfix = [];
    let stack = [];

    for (let token of reversed) {
        if (!isNaN(token)) {
            postfix.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                postfix.push(stack.pop());
            }
            stack.pop();
        } else {
            while (stack.length && precedence[stack[stack.length - 1]] > precedence[token]) {
                postfix.push(stack.pop());
            }
            stack.push(token);
        }
    }
    while (stack.length) postfix.push(stack.pop());
    // invierte
    return postfix.reverse();
}


function evaluatePostfix(postfix) {
    let stack = [];
    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            let b = stack.pop();
            let a = stack.pop();
            if (token === '+') stack.push(a + b);
            if (token === '-') stack.push(a - b);
            if (token === '*') stack.push(a * b);
            if (token === '/') stack.push(a / b);
        }
    }
    return stack[0];
}





// contador
function processExpression() {
    const input = document.getElementById('expression-input').value;
    const tokens = tokenize(input);

    if (tokens.length === 0) {
        alert("Por favor, ingresa una expresión válida.");
        return;
    }

    const postfix = infixToPostfix(tokens);
    const prefix = infixToPrefix(tokens);
    const result = evaluatePostfix(postfix);

    document.getElementById('res-in').innerText = tokens.join(' ');
    document.getElementById('res-pre').innerText = prefix.join(' ');
    document.getElementById('res-post').innerText = postfix.join(' ');
    document.getElementById('res-eval').innerText = (result !== undefined && !isNaN(result)) ? result : "Error en la sintaxis";
}







// generador de problemas

const exerciseList = [
   // lv 1, basicas
    "4 + 5",
    "9 - 3",
    "6 * 2",
    "8 / 4",
    
    // Lv 2, Precedencia de operadores
    "3 + 4 * 2",
    "10 - 6 / 2",
    "5 * 3 + 4",
    "12 / 3 - 2",
    
    // Lv 3, Rompiendo la precedencia 
    "( 3 + 4 ) * 2",
    "10 - ( 6 / 2 )", 
    "( 5 * 3 ) + 4",
    "12 / ( 3 - 2 )",
    
    //Lv 4, Operaciones combinadas
    "2 + 3 * 4 - 5",
    "8 - 4 / 2 + 3",
    "( 4 + 2 ) * ( 5 - 1 )",
    "( 9 - 3 ) / ( 1 + 2 )",
    
    // lv 5: Anidamiento profundo 
    "( ( 2 + 3 ) * 4 ) - 5",
    "10 + ( ( 8 - 2 ) / 3 )",
    "( 5 + 3 ) * ( ( 4 - 2 ) + 1 )",
    "( ( 10 + 2 ) / 3 ) * ( ( 4 - 1 ) + 2 )"
];







function renderExercises() {
    const container = document.getElementById('exercises-container');
    container.innerHTML = ''; 

    exerciseList.forEach((expr, index) => {
        
        const tokens = tokenize(expr);
        const postfix = infixToPostfix(tokens);
        const prefix = infixToPrefix(tokens);
        const result = evaluatePostfix(postfix);

        const cardHtml = `
            <div class="exercise-card">
                <h3>Ejercicio ${index + 1} ${getDifficultyLabel(index)}</h3>
                <p>Expresión: <strong>${expr}</strong></p>
                <button class="toggle-btn" onclick="toggleAnswer('ans-dyn-${index}')">Mostrar / Ocultar Resultado</button>
                <div id="ans-dyn-${index}" class="answer hidden-answer">
                    <p><strong>Preorden (Prefija):</strong> ${prefix.join(' ')}</p>
                    <p><strong>Postorden (Postfija):</strong> ${postfix.join(' ')}</p>
                    <p><strong>Resultado Final:</strong> ${result}</p>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}





// etiquetas
function getDifficultyLabel(index) {
    if (index < 4) return '<span style="color: #22c55e; font-size: 0.8em;">(Básico)</span>';
    if (index < 8) return '<span style="color: #eab308; font-size: 0.8em;">(Precedencia)</span>';
    if (index < 12) return '<span style="color: #f97316; font-size: 0.8em;">(Paréntesis)</span>';
    if (index < 16) return '<span style="color: #ef4444; font-size: 0.8em;">(Combinado)</span>';
    return '<span style="color: #a855f7; font-size: 0.8em;">(Anidado Profundo)</span>';
}





// hacer auto problemas
window.addEventListener('DOMContentLoaded', renderExercises);


const API_URL = "http://localhost:3000/api";


let gameState = {
    playerName: "",
    score: 0,
    currentExpression: "",
    currentTokens: [],
    expectedAnswer: "",
    typeAsked: "" 
};


function showSection(sectionId) {
    document.getElementById('calculator').classList.add('hidden-section');
    document.getElementById('exercises').classList.add('hidden-section');
    document.getElementById('game').classList.add('hidden-section');
    
    document.getElementById('calculator').classList.remove('active-section');
    document.getElementById('exercises').classList.remove('active-section');
    document.getElementById('game').classList.remove('active-section');

    document.getElementById(sectionId).classList.remove('hidden-section');
    document.getElementById(sectionId).classList.add('active-section');
    navLinks.classList.remove('active'); 

    if(sectionId === 'game') {
        fetchRanking();
    }
}


function generateRandomExpression(score) {
    const operators = ['+', '-', '*', '/'];
    const getRandomNum = () => Math.floor(Math.random() * 9) + 1; // 1 a 9
    const getRandomOp = () => operators[Math.floor(Math.random() * operators.length)];

    //mas puntos = mas dificultad
    if (score < 3) {

        return `${getRandomNum()} ${getRandomOp()} ${getRandomNum()}`;
    } else if (score < 8) {
        
        return `${getRandomNum()} ${getRandomOp()} ${getRandomNum()} ${getRandomOp()} ${getRandomNum()}`;
    } else if (score < 15) {

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
    
    // Cambiar vistas
    document.getElementById('game-setup').classList.add('hidden-section');
    document.getElementById('game-play').classList.remove('hidden-section');
    document.getElementById('game-over').classList.add('hidden-section');
    
    nextChallenge();
}

function nextChallenge() {

    document.getElementById('game-answer').value = "";

    const expr = generateRandomExpression(gameState.score);
    gameState.currentExpression = expr;
    gameState.currentTokens = tokenize(expr);
    
  
    const askPrefix = Math.random() < 0.5;
    
    if (askPrefix) {
        gameState.typeAsked = "prefix";
        document.getElementById('game-question-label').innerHTML = `<strong>Preorden (Prefija) de la expresión:</strong>`;
        gameState.expectedAnswer = infixToPrefix(gameState.currentTokens).join(' ').trim();
    } else {
        gameState.typeAsked = "postfix";
        document.getElementById('game-question-label').innerHTML = `<strong>Postorden (Postfija) de la expresión:</strong>`;
        gameState.expectedAnswer = infixToPostfix(gameState.currentTokens).join(' ').trim();
    }
    
    document.getElementById('game-expression').innerText = expr;
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