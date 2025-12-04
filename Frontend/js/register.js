document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        // Ya no necesitamos 'messageElement'
        const submitBtn = registerForm.querySelector('.submit-btn');


        // Validaciones
        if (password !== passwordConfirm) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            return;
        }

        if (password.length < 8) {
            Swal.fire({
                title: 'Contraseña Débil',
                text: 'Tu contraseña debe tener al menos 8 caracteres.',
                icon: 'warning',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            return;
        }

        // ✅ VALIDAR CAPTCHA
        const captchaResponse = grecaptcha.getResponse();
        
        if (!captchaResponse) {
            
            Swal.fire({
                title: 'Falta el Captcha',
                text: 'Por favor, confirma que no eres un robot.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                background: '#1a202c', // Tu tema dark
                color: '#e2e8f0'
            });
            return; 
        }


        submitBtn.textContent = 'Creando...';
        submitBtn.disabled = true;

        try {
            // Enviar al backend CON el token del captcha
            const response = await fetch('https://tech-up.westus2.cloudapp.azure.com/tech-up/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    password: password,
                    captchaToken: captchaResponse // ← Incluir el token
                })
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