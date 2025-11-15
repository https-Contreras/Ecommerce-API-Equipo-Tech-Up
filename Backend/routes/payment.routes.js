// 📁 Backend/routes/payment.routes.js

const express = require('express');
const router = express.Router();
const { verifyCaptcha } = require('../middleware/captcha.middleware');

// Ruta para procesar pagos (CON verificación de CAPTCHA)
router.post('/procesar-pago', verifyCaptcha, async (req, res) => {
    try {
        const { metodo, datos, total } = req.body;
        
        // ✅ Si llegaste aquí, el CAPTCHA es válido (gracias al middleware)
        
        console.log('✅ Procesando pago con CAPTCHA válido:', { metodo, total });
        
        // 🔐 Aquí va tu lógica de pago real
        // Por ejemplo: procesar tarjeta, registrar transferencia, etc.
        
        // Simular procesamiento exitoso
        const ordenId = Math.floor(100000 + Math.random() * 900000);
        
        res.json({
            success: true,
            message: 'Pago procesado exitosamente',
            ordenId: ordenId,
            metodo: metodo
        });
        
    } catch (error) {
        console.error('❌ Error procesando pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el pago'
        });
    }
});

module.exports = router;