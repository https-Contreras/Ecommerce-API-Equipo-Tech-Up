document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; 

    loginForm.addEventListener('submit', async (event) => {
        // 1. Evita que la página se recargue
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Ya no necesitamos 'messageElement'
        const submitBtn = loginForm.querySelector('.submit-btn');

        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;

        try {
            // 2. Llama a tu API de backend
            const response = await fetch('http://localhost:3000/tech-up/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // 3. Esperamos la respuesta JSON del backend
            const data = await response.json();

            // 4. Reaccionamos según la respuesta
            if (response.ok) {
                
                // --- ¡ÉXITO CON ALERTA "CHIDOTA"! ---
                Swal.fire({
                    title: '¡Bienvenido!',
                    text: data.message,
                    icon: 'success',
                    timer: 2000, // Se cierra solo en 2 segundos
                    showConfirmButton: false, // Oculta el botón de "OK"
                    // Estilos para tu tema "tech"
                    background: '#1a202c', // Tu color --color-surface
                    color: '#e2e8f0'       // Tu color --color-text
                });
                
                // Guardamos en localStorage
                localStorage.setItem('userName', data.user.nombre);
                localStorage.setItem('userToken', data.token);

                // Redirigimos después de que la alerta se cierre
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); // 2 segundos
                
            } else {
                
                // --- ¡ERROR CON ALERTA "CHIDOTA"! ---
                Swal.fire({
                    title: 'Error de Acceso',
                    text: data.message || 'Error en tus credenciales',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo',
                    background: '#1a202c',
                    color: '#e2e8f0'
                });
                
                submitBtn.textContent = 'Entrar';
                submitBtn.disabled = false;
            }

        } catch (error) {
            
            // --- ¡ERROR DE RED CON ALERTA "CHIDOTA"! ---
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar al servidor. Intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: '#1a202c',
                color: '#e2e8f0'
            });

            console.error('Error de fetch:', error);
            submitBtn.textContent = 'Entrar';
            submitBtn.disabled = false;
        }
    });
});