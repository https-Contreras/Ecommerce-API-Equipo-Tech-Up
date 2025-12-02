document.addEventListener('DOMContentLoaded', () => {

    // 1. Extraer el TOKEN de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Si no hay token, algo anda mal (alguien entró directo sin link)
    if (!token) {
        Swal.fire({
            title: 'Error',
            text: 'No se encontró el token de seguridad. Usa el enlace de tu correo.',
            icon: 'error',
            confirmButtonText: 'Ir al Login',
            background: '#1a202c',
            color: '#e2e8f0'
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    const resetForm = document.getElementById('reset-form');
    if (!resetForm) return;

    resetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        const submitBtn = resetForm.querySelector('.submit-btn');

        // 2. Validaciones básicas
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
                text: 'Debe tener al menos 8 caracteres.',
                icon: 'warning',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            return;
        }

        submitBtn.textContent = 'Guardando...';
        submitBtn.disabled = true;

        try {
            // 3. Enviar al Backend
            const response = await fetch('http://tech-up.westus2.cloudapp.azure.com:3000/tech-up/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token, // Enviamos el token que sacamos de la URL
                    newPassword: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // --- ÉXITO ---
                Swal.fire({
                    title: '¡Contraseña Actualizada!',
                    text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
                    icon: 'success',
                    background: '#1a202c',
                    color: '#e2e8f0',
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            } else {
                // --- ERROR (Token expirado o inválido) ---
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'El enlace ha expirado o es inválido.',
                    icon: 'error',
                    background: '#1a202c',
                    color: '#e2e8f0'
                });
                submitBtn.textContent = 'Guardar Nueva Contraseña';
                submitBtn.disabled = false;
            }

        } catch (error) {
            console.error(error);
            Swal.fire({ title: 'Error de Conexión', text: 'Intenta más tarde', icon: 'error', background: '#1a202c', color: '#e2e8f0' });
            submitBtn.textContent = 'Guardar Nueva Contraseña';
            submitBtn.disabled = false;
        }
    });
});