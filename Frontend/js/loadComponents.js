/**
 * Carga un componente HTML (header/footer) en un elemento del DOM.
 */
async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar ${url}: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`No se encontró el elemento con ID: ${elementId}`);
        }
    } catch (error) {
        console.error(`No se pudo cargar el componente: ${error}`);
    }
}

/**
 * Revisa si hay un usuario logueado en localStorage
 * y actualiza el header.
 */
function checkLoginStatus() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const headerTools = document.querySelector('#main-header .header-tools');
        if (headerTools) {
            const loginBtn = headerTools.querySelector('.login-btn');
            const registerBtn = headerTools.querySelector('.register-btn');
            
            if (loginBtn && registerBtn) {
                const welcomeSpan = document.createElement('span');
                welcomeSpan.className = 'header-username';
                welcomeSpan.textContent = `Hola, ${userName.split(' ')[0]}`;

                const logoutButton = document.createElement('button');
                logoutButton.id = 'logout-btn';
                logoutButton.className = 'logout-btn';
                logoutButton.textContent = 'Cerrar Sesión';

                loginBtn.replaceWith(welcomeSpan);
                registerBtn.replaceWith(logoutButton);
                
                // Llamamos a la función que le da vida al botón
                addLogoutEvent();
            }
        }
    }
}


function addLogoutEvent() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Detenemos la acción por defecto

            // 1. Borra al usuario de la memoria
            localStorage.removeItem('userName');
            localStorage.removeItem('userToken');

            // 2. Muestra la alerta 
            Swal.fire({
                title: '¡Sesión cerrada!',
                text: 'Has cerrado sesión exitosamente. ¡Vuelve pronto!',
                icon: 'success',
                timer: 3000, // 2 segundos
                showConfirmButton: false,
                background: '#1a202c', // Tu color --color-surface
                color: '#e2e8f0'       // Tu color --color-text
            
            }).then(() => {
                // 3. Después de que la alerta se cierre, redirige
                window.location.href = 'index.html'; 
            });
        });
    }
}

/**
 * Espera a que el DOM esté cargado para inyectar los componentes.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargamos el header y el footer
    Promise.all([
        loadComponent('components/header.html', 'main-header'),
        loadComponent('components/footer.html', 'main-footer')
    ]).then(() => {
        // 2. DESPUÉS de que se cargaron, revisamos el login
        checkLoginStatus();
    });
});