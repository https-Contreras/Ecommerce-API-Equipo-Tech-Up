const axios = require('axios');

async function verifyCaptcha(req, res, next) {
    const { captchaToken } = req.body;
    
    if (!captchaToken) {
        return res.status(400).json({ 
            success: false, 
            message: 'CAPTCHA no proporcionado' 
        });
    }
    
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY, // Tu Secret Key
                    response: captchaToken
                }
            }
        );
        
        if (response.data.success) {
            next(); // CAPTCHA válido, continuar
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'CAPTCHA inválido' 
            });
        }
    } catch (error) {
        console.error('Error verificando CAPTCHA:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al verificar CAPTCHA' 
        });
    }
}

module.exports = { verifyCaptcha };