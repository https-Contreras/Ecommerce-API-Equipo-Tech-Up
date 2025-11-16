document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('register-form');
    if (!registerForm) return; // No hacer nada si no estamos en esta página

    registerForm.addEventListener('submit', async (event) => {
        // 1. Evita que la página se recargue
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        // Ya no necesitamos 'messageElement'
        const submitBtn = registerForm.querySelector('.submit-btn');

        // --- INICIO DE VALIDACIÓN EN CLIENTE ---
        
        // 2. Revisa que las contraseñas coincidan
        if (password !== passwordConfirm) {
            Swal.fire({
                title: 'Error de Validación',
                text: 'Las contraseñas no coinciden. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: '#1a202c', // Tu color --color-surface
                color: '#e2e8f0'       // Tu color --color-text
            });
            return; // Detiene la ejecución
        }

        if (password.length < 8) {
             Swal.fire({
                title: 'Contraseña Débil',
                text: 'Tu contraseña debe tener al menos 8 caracteres.',
                icon: 'warning', // 'warning' es bueno para esto
                confirmButtonText: 'Entendido',
                background: '#1a202c',
                color: '#e2e8f0'
            });
             return; // Detiene la ejecución
        }
        // --- FIN DE VALIDACIÓN EN CLIENTE ---

        submitBtn.textContent = 'Creando...';
        submitBtn.disabled = true;

        // 4. Prepara los datos para el backend
        const formData = {
            nombre: nombre,
            email: email,
            password: password
        };
        
        try {
            // --- INICIO DE LLAMADA AL BACKEND ---
            // (Aquí conectarás tu controlador de register)
            const response = await fetch('http://localhost:3000/tech-up/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // --- ÉXITO ---
                Swal.fire({
                    title: '¡Cuenta Creada!',
                    text: data.message || '¡Usuario registrado con éxito!',
                    icon: 'success',
                    background: '#1a202c',
                    color: '#e2e8f0'
                });
                
                submitBtn.textContent = 'Crear Cuenta';
                submitBtn.disabled = false;
                registerForm.reset(); // Limpia el formulario
                
                 //Redirigir al login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {
                // --- ERROR DEL SERVIDOR (Ej. email ya existe) ---
                Swal.fire({
                    title: 'Error en el Registro',
                    text: data.message || 'No se pudo completar el registro.',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo',
                    background: '#1a202c',
                    color: '#e2e8f0'
                });
                submitBtn.textContent = 'Crear Cuenta';
                submitBtn.disabled = false;
            }
            // --- FIN DE LLAMADA AL BACKEND ---

        } catch (error) {
            console.error("Error de fetch:", error);
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar al servidor. Intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            submitBtn.textContent = 'Crear Cuenta';
            submitBtn.disabled = false;
        }
    });
});