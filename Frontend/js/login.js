document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('login-message');
        const submitBtn = loginForm.querySelector('.submit-btn');

        messageElement.textContent = '';

        // ✅ VALIDAR CAPTCHA
        const captchaResponse = grecaptcha.getResponse();
        
        if (!captchaResponse) {
            messageElement.textContent = 'Por favor, completa el CAPTCHA.';
            messageElement.style.color = '#ff4d4d';
            return;
        }

        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/tech-up/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    captchaToken: captchaResponse // ← Incluir el token
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Login exitoso!');
                messageElement.textContent = '¡Login exitoso!';
                messageElement.style.color = 'var(--color-primary)';
            } else {
                messageElement.textContent = data.message || 'Error en tus credenciales';
                messageElement.style.color = '#ff4d4d';
                grecaptcha.reset();
            }

        } catch (error) {
            console.error('Error:', error);
            messageElement.textContent = 'No se pudo conectar al servidor.';
            messageElement.style.color = '#ff4d4d';
            grecaptcha.reset();
        }

        submitBtn.textContent = 'Entrar';
        submitBtn.disabled = false;
    });
});