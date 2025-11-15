document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        const messageElement = document.getElementById('register-message');
        const submitBtn = registerForm.querySelector('.submit-btn');

        messageElement.textContent = '';

        // Validaciones
        if (password !== passwordConfirm) {
            messageElement.textContent = 'Las contraseñas no coinciden.';
            messageElement.style.color = '#ff4d4d';
            return;
        }

        if (password.length < 8) {
            messageElement.textContent = 'Tu contraseña debe tener al menos 8 caracteres.';
            messageElement.style.color = '#ff4d4d';
            return;
        }

        // ✅ VALIDAR CAPTCHA
        const captchaResponse = grecaptcha.getResponse();
        
        if (!captchaResponse) {
            messageElement.textContent = 'Por favor, completa el CAPTCHA.';
            messageElement.style.color = '#ff4d4d';
            return;
        }

        submitBtn.textContent = 'Creando...';
        submitBtn.disabled = true;

        try {
            // Enviar al backend CON el token del captcha
            const response = await fetch('http://localhost:3000/tech-up/users/register', {
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
                messageElement.textContent = '¡Cuenta creada con éxito!';
                messageElement.style.color = 'var(--color-primary)';
                registerForm.reset();
                grecaptcha.reset(); // Resetear el captcha
            } else {
                messageElement.textContent = data.message || 'Error al crear la cuenta';
                messageElement.style.color = '#ff4d4d';
                grecaptcha.reset();
            }

        } catch (error) {
            console.error('Error:', error);
            messageElement.textContent = 'No se pudo conectar al servidor.';
            messageElement.style.color = '#ff4d4d';
            grecaptcha.reset();
        }

        submitBtn.textContent = 'Crear Cuenta';
        submitBtn.disabled = false;
    });
});