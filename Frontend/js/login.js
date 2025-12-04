document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('.submit-btn');

        // 1. ✅ VALIDAR CAPTCHA ANTES DE NADA
        // Verificamos que grecaptcha esté cargado para evitar errores
        if (typeof grecaptcha === 'undefined') {
            console.error('El script de reCAPTCHA no se ha cargado.');
            return;
        }

        const captchaResponse = grecaptcha.getResponse();

        if (!captchaResponse) {
            // ALERTA SI FALTA EL CAPTCHA
            Swal.fire({
                title: 'Falta el Captcha',
                text: 'Por favor, confirma que no eres un robot.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                background: '#1a202c', // Tu tema dark
                color: '#e2e8f0'
            });
            return; // Detenemos el código aquí, no se envía nada al back
        }

        // Si pasó el captcha, procedemos
        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://tech-up.westus2.cloudapp.azure.com:3000/tech-up/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    captchaToken: captchaResponse // Enviamos el token al back
                })
            });

            const data = await response.json();

            if (response.ok) {
                // --- ÉXITO ---
                Swal.fire({
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#1a202c',
                    color: '#e2e8f0'
                }).then(() => {
                    localStorage.setItem('userName', data.user.nombre);
                    localStorage.setItem('userToken', data.token);
                    window.location.href = 'index.html';
                });

            } else {
                // --- ERROR (Credenciales o Captcha inválido en back) ---
                Swal.fire({
                    title: 'Error de Acceso',
                    text: data.message || 'Credenciales incorrectas',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo',
                    background: '#1a202c',
                    color: '#e2e8f0'
                });

                submitBtn.textContent = 'Entrar';
                submitBtn.disabled = false;
                grecaptcha.reset(); // Reseteamos captcha para que intenten de nuevo
            }

        } catch (error) {
            console.error('Error:', error);
            
            // --- ERROR DE RED ---
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar al servidor. Intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: '#1a202c',
                color: '#e2e8f0'
            });

            submitBtn.textContent = 'Entrar';
            submitBtn.disabled = false;
            grecaptcha.reset();
        }
    });
});