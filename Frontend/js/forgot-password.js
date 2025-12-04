document.addEventListener('DOMContentLoaded', () => {

    const forgotForm = document.getElementById('forgot-form');
    if (!forgotForm) return;

    forgotForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const submitBtn = forgotForm.querySelector('.submit-btn');
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // 1. Llama a tu API de backend (tu ruta '/tech-up/users/forgot-password')
            const response = await fetch('https://tech-up.westus2.cloudapp.azure.com:3000/tech-up/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            // 2. Muestra la alerta "chidota" (SIEMPRE se ve exitosa)
            Swal.fire({
                title: '¡Revisa tu correo!',
                text: data.message, // "Si tu correo está registrado..."
                icon: 'success',
                confirmButtonText: 'Entendido',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            
            submitBtn.textContent = 'Enviar Enlace';
            submitBtn.disabled = false;

        } catch (error) {
            console.error("Error de fetch:", error);
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar al servidor.',
                icon: 'error',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            submitBtn.textContent = 'Enviar Enlace';
            submitBtn.disabled = false;
        }
    });
});