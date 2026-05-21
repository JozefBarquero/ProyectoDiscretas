// Respuestas btn
function toggleAnswer(ansId) {
    const el = document.getElementById(ansId);
    el.classList.toggle('hidden-answer');
}

// Generador de problemas
const exerciseList = [
   // lv 1, basicas
    "4 + 5", "9 - 3", "6 * 2", "8 / 4",
    // Lv 2, 
    "3 + 4 * 2", "10 - 6 / 2", "5 * 3 + 4", "12 / 3 - 2",
    // Lv 3, 
    "( 3 + 4 ) * 2", "10 - ( 6 / 2 )", "( 5 * 3 ) + 4", "12 / ( 3 - 2 )",
    // Lv 4, Operaciones combinadas
    "2 + 3 * 4 - 5", "8 - 4 / 2 + 3", "( 4 + 2 ) * ( 5 - 1 )", "( 9 - 3 ) / ( 1 + 2 )",
    // Lv 5: Anidamiento profundo 
    "( ( 2 + 3 ) * 4 ) - 5", "10 + ( ( 8 - 2 ) / 3 )", "( 5 + 3 ) * ( ( 4 - 2 ) + 1 )", "( ( 10 + 2 ) / 3 ) * ( ( 4 - 1 ) + 2 )"
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

// auto problemas 
window.addEventListener('DOMContentLoaded', renderExercises);