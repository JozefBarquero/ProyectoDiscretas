// Separa numeros de simbolos
function tokenize(expr) {
    return expr.match(/\d+|\+|\-|\*|\/|\(|\)/g) || [];
}

const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

// Inorden a Postorden 
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

// Inorden a Preorden
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
    return postfix.reverse();
}

//  Postfija
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