// 📁 Backend/routes/contact.routes.js

const express = require('express');
const router = express.Router();
const { verifyCaptcha } = require('../middleware/captcha.middleware');

// Ruta para procesar formulario de contacto (CON verificación de CAPTCHA)
router.post('/contact', verifyCaptcha, async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;
        
        // ✅ Si llegaste aquí, el CAPTCHA es válido
        
        console.log('✅ Mensaje de contacto recibido con CAPTCHA válido:', { 
            nombre, 
            email, 
            asunto 
        });
        
        // 📧 Aquí integrarías con un servicio de email como:
        // - Nodemailer
        // - SendGrid
        // - AWS SES
        
        // Por ahora simulamos el envío exitoso
        res.json({
            success: true,
            message: 'Mensaje enviado exitosamente'
        });
        
    } catch (error) {
        console.error('❌ Error enviando mensaje:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje'
        });
    }
});

module.exports = router;