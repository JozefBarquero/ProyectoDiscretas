const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Menu movil
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Navegacion de secciones
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
        if (typeof fetchRanking === 'function') {
            fetchRanking();
        }
    }
}