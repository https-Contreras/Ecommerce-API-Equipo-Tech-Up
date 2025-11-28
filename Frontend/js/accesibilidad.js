document.addEventListener('DOMContentLoaded', () => {
    // Esperamos un poco para asegurar que el header cargó
    setTimeout(initAccessibility, 100);
});

function initAccessibility() {
    const btnMenu = document.getElementById('accessibility-btn');
    const menu = document.getElementById('accessibility-menu');
    const btnTheme = document.getElementById('btn-toggle-theme');
    const btnIncrease = document.getElementById('btn-font-increase');
    const btnDecrease = document.getElementById('btn-font-decrease');
    const btnReset = document.getElementById('btn-access-reset');

    if (!btnMenu || !menu) return; // Si no cargó el header, salir

    // 1. Toggle del Menú
    btnMenu.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // 2. Recuperar preferencias al iniciar 
    loadPreferences();

    // --- LÓGICA DE TEMA ---
    btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        savePreference('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    
    // Usamos variables CSS para escalar todo
    let currentScale = 100; // Porcentaje

    btnIncrease.addEventListener('click', () => {
        if (currentScale < 150) { // Límite máximo
            currentScale += 10;
            applyFontSize(currentScale);
        }
    });

    btnDecrease.addEventListener('click', () => {
        if (currentScale > 70) { // Límite mínimo
            currentScale -= 10;
            applyFontSize(currentScale);
        }
    });

    // --- RESTAURAR ---
    btnReset.addEventListener('click', () => {
        document.body.classList.remove('light-mode'); // Volver a Dark (default)
        currentScale = 100;
        applyFontSize(100);
        
        // Borrar preferencias del usuario actual
        const userKey = getUserKey();
        localStorage.removeItem(`theme_${userKey}`);
        localStorage.removeItem(`font_${userKey}`);
    });

    // --- FUNCIONES AUXILIARES ---

    function applyFontSize(scale) {
        const newSize = (16 * (scale / 100)) + 'px';
        document.documentElement.style.setProperty('--font-size-base', newSize);
        savePreference('font', scale);
    }

    // --- PERSISTENCIA "INTELIGENTE" ---
    
    // Obtiene una llave única: el nombre de usuario O 'guest' si no hay nadie
    function getUserKey() {
        const user = localStorage.getItem('userName');
        return user ? user.replace(/\s+/g, '_') : 'guest';
    }

    function savePreference(key, value) {
        const userKey = getUserKey();
        localStorage.setItem(`${key}_${userKey}`, value);
        console.log(`Preferencia guardada: ${key}_${userKey} = ${value}`);
    }

    function loadPreferences() {
        const userKey = getUserKey();
        
        // 1. Cargar Tema
        const savedTheme = localStorage.getItem(`theme_${userKey}`);
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }

        // 2. Cargar Fuente
        const savedFont = localStorage.getItem(`font_${userKey}`);
        if (savedFont) {
            currentScale = parseInt(savedFont);
            // Aplicamos directamente al estilo sin llamar a savePreference de nuevo
            const newSize = (16 * (currentScale / 100)) + 'px';
            document.documentElement.style.setProperty('--font-size-base', newSize);
        }
    }
}