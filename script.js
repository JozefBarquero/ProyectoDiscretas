// Interfaz
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');



// menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});




// navegacion
function showSection(sectionId) {
    document.getElementById('calculator').classList.add('hidden-section');
    document.getElementById('exercises').classList.add('hidden-section');
    document.getElementById('calculator').classList.remove('active-section');
    document.getElementById('exercises').classList.remove('active-section');

    document.getElementById(sectionId).classList.remove('hidden-section');
    document.getElementById(sectionId).classList.add('active-section');
    navLinks.classList.remove('active'); // Cierra el menú en móviles
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