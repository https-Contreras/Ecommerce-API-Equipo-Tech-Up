document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const msgElement = document.getElementById('form-message');

        // ✅ VALIDAR CAPTCHA
        const captchaResponse = grecaptcha.getResponse();
        
        if (!captchaResponse) {
            msgElement.textContent = 'Por favor, completa el CAPTCHA.';
            msgElement.style.color = '#ff4d4d';
            return;
        }

        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            asunto: document.getElementById('asunto').value,
            mensaje: document.getElementById('mensaje').value,
            captchaToken: captchaResponse // ← Incluir el token
        };

        try {
            const response = await fetch('http://localhost:3000/tech-up/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                msgElement.textContent = "¡Mensaje enviado!";
                msgElement.style.color = "var(--color-primary)";
                contactForm.reset();
                grecaptcha.reset();
            } else {
                msgElement.textContent = data.message || "Error al enviar el mensaje";
                msgElement.style.color = '#ff4d4d';
                grecaptcha.reset();
            }

        } catch (error) {
            msgElement.textContent = 'Error de conexión.';
            msgElement.style.color = '#ff4d4d';
            grecaptcha.reset();
        }

        submitBtn.textContent = 'Enviar Mensaje';
        submitBtn.disabled = false;
    });
});