

function tokenize(expr) {

    let processedExpr = expr.replace(/(\d)\s*(?=\()/g, '$1 * ');
    processedExpr = processedExpr.replace(/\)\s*(?=\d|\()/g, ') * ');
    
    return processedExpr.match(/\d+|\+|\-|\*|\/|\^|\(|\)/g) || [];
}


const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };


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
            while (stack.length && stack[stack.length - 1] !== '(') {
                let top = stack[stack.length - 1];
             
                let condition = (token === '^') ? 
                    (precedence[top] > precedence[token]) : 
                    (precedence[top] >= precedence[token]);
                
                if (condition) {
                    output.push(stack.pop());
                } else {
                    break;
                }
            }
            stack.push(token);
        }
    }
    while (stack.length) output.push(stack.pop());
    return output;
}


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
            while (stack.length && stack[stack.length - 1] !== '(') {
                let top = stack[stack.length - 1];
                // Asociatividad invertida al recorrer la expresión al revés
                let condition = (token === '^') ? 
                    (precedence[top] >= precedence[token]) : 
                    (precedence[top] > precedence[token]);

                if (condition) {
                    postfix.push(stack.pop());
                } else {
                    break;
                }
            }
            stack.push(token);
        }
    }
    while (stack.length) postfix.push(stack.pop());
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
            if (token === '^') stack.push(Math.pow(a, b)); // Nueva evaluación
        }
    }
    return stack[0];
}


class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

function buildTree(postfix) {
    let stack = [];
    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(new TreeNode(token));
        } else {
            let node = new TreeNode(token);
            node.right = stack.pop(); 
            node.left = stack.pop(); 
            stack.push(node);
        }
    }
    return stack[0];
}

function drawTreeOnCanvas(root) {
    const canvas = document.getElementById('tree-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
  
    if (!root) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }


    function getTreeDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
    }

    const depth = getTreeDepth(root);


    const verticalSpacing = 70; 
    const nodeRadius = 20;      

   
    canvas.height = Math.max(400, depth * verticalSpacing + 60);


    const maxLeaves = Math.pow(2, depth - 1);
    canvas.width = Math.max(600, maxLeaves * 40); 

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    function drawNode(node, x, y, horizontalOffset) {
        if (!node) return;

        ctx.strokeStyle = '#000000'; //Linea izquierda
        ctx.lineWidth = 2;

       
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            const nextX = x - horizontalOffset;
            const nextY = y + verticalSpacing;
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
           
            drawNode(node.left, nextX, nextY, horizontalOffset / 2);
        }
        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            const nextX = x + horizontalOffset;
            const nextY = y + verticalSpacing;
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
            drawNode(node.right, nextX, nextY, horizontalOffset / 2);
        }

       
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = isNaN(node.value) ? '#3670c2' : '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#000000'; //Linea derecha
        ctx.stroke();

       
        ctx.fillStyle = '#000000';
     
        ctx.font = node.value.toString().length > 3 ? 'bold 11px Arial' : 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value, x, y);
    }


    drawNode(root, canvas.width / 2, 40, canvas.width / 4);
}

function getEntreorden(node) {
    if (!node) return [];
    let result = [];
    if (node.left) result = result.concat(getEntreorden(node.left));
    result.push(node.value);
    if (node.right) result = result.concat(getEntreorden(node.right));
    return result;
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

    const rootNode = buildTree(postfix);
    const entreorden = getEntreorden(rootNode);

   
    document.getElementById('res-in').innerText = entreorden.join(' ');
    document.getElementById('res-pre').innerText = prefix.join(' ');
    document.getElementById('res-post').innerText = postfix.join(' ');
    document.getElementById('res-eval').innerText = (result !== undefined && !isNaN(result)) ? result : "Error en la sintaxis";

    drawTreeOnCanvas(rootNode);
}