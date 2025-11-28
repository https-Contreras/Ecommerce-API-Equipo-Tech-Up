const nodemailer = require('nodemailer');

// Variable global para el transporter (Singleton)
let transporter = null;

/**
 * Configura el transporter de Nodemailer para usar Gmail
 * Usa las credenciales del archivo .env
 */
function setupMailer() {
    // Si ya lo creamos, lo re-usamos
    if (transporter) return transporter;

    // 1. Verificamos que las credenciales existan en .env
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.error("*************************************************");
        console.error("ERROR: Faltan variables MAIL_USER o MAIL_PASS en .env");
        console.error("No se podrán enviar correos reales.");
        console.error("*************************************************");
        return null;
    }

    // 2. Creamos el transporter
    transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER, // Tu correo
            pass: process.env.MAIL_PASS  // Tu App Password
        },
    });

    return transporter;
}

/**
 * Función genérica para enviar correos
 * @param {string} to - Destinatario
 * @param {string} subject - Asunto
 * @param {string} html - Cuerpo HTML
 */
const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        const mailTransporter = setupMailer();
        if (!mailTransporter) return;

        const info = await mailTransporter.sendMail({
            from: `"Tech-Up" <${process.env.MAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments // <--- ¡Ahora sí los pasamos a Gmail!
        });

        console.log("Correo enviado. ID:", info.messageId);
        
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
};
/**
 * Envía un correo de bienvenida al usuario que se suscribe
 */const sendWelcomeEmail = async (toEmail) => {
    const subject = "🎉 ¡Bienvenido a Tech-Up Elite!";
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            
            /* HEADER CON LOGO Y LEMA */
            .header { 
                background-color: #1a202c; /* Fondo oscuro tech */
                padding: 30px; 
                text-align: center; 
            }
            .header img { width: 60px; height: 60px; margin-bottom: 10px; }
            .header h1 { margin: 0; color: #00e5ff; font-size: 28px; letter-spacing: 1px; }
            .header p { margin: 5px 0 0; color: #a0aec0; font-style: italic; font-size: 14px; }

            .content { background: #ffffff; padding: 40px 30px; }
            .welcome-title { color: #1a202c; text-align: center; margin-top: 0; }
            
            .button { display: inline-block; background: #00e5ff; color: #1a202c; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: #00c4d9; }

            .coupon-box { background: #f0f2f5; padding: 20px; text-align: center; border: 2px dashed #00e5ff; border-radius: 8px; margin: 20px 0; }
            
            .footer { background-color: #eee; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="/Backend/public/images/logo.png" alt="Tech-Up Logo">
                <h1>Tech-Up</h1>
                <p>"El futuro del cómputo, ahora"</p>
            </div>

            <div class="content">
                <h2 class="welcome-title">¡Gracias por unirte a la élite tecnológica!</h2>
                <p>Estamos emocionados de tenerte con nosotros. A partir de ahora recibirás:</p>
                <ul>
                    <li>✨ Ofertas exclusivas</li>
                    <li>🎁 Cupones de descuento</li>
                    <li>🔥 Acceso anticipado a nuevos productos</li>
                    <li>📰 Noticias sobre tecnología</li>
                </ul>
                
                <p>Como agradecimiento, aquí está tu cupón de bienvenida:</p>
                
                <div class="coupon-box">
                    <h2 style="color: #1a202c; margin: 0; letter-spacing: 2px;">WELCOME10</h2>
                    <p style="margin: 5px 0; color: #555;">10% de descuento en tu primera compra</p>
                </div>
                
                <center>
                    <a href="http://localhost:5500/index.html" class="button">Explorar Productos</a>
                </center>
                
                <p style="text-align: center; margin-top: 30px;">¡Prepárate para la mejor experiencia tecnológica!</p>
            </div>

            <div class="footer">
                <p>&copy; 2025 Tech-Up. Todos los derechos reservados.</p>
                <p>Proyecto académico de Programación de Sistemas WEB</p>
                <p>Si no solicitaste esta suscripción, puedes ignorar este correo.</p>
            </div>
        </div>
    </body>
    </html>
  `;

    return await sendEmail(toEmail, subject, html);
};

/**
 * Envía una notificación al admin cuando alguien se suscribe
 */
const sendAdminNotification = async (subscriberEmail) => {
    // Asegúrate de tener ADMIN_EMAIL en tu .env o cámbialo aquí
    const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    const subject = "🔔 Nueva suscripción en Tech-Up";

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #ecf0f1; padding: 20px; border-radius: 0 0 5px 5px; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #3498db; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>📧 Nueva Suscripción</h2>
            </div>
            <div class="content">
                <p>¡Tienes un nuevo suscriptor en Tech-Up!</p>
                <div class="info-box">
                    <p><strong>Email:</strong> ${subscriberEmail}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}</p>
                </div>
                <p>El usuario ha recibido su correo de bienvenida con el cupón WELCOME10.</p>
            </div>
        </div>
    </body>
    </html>
  `;

    return await sendEmail(adminEmail, subject, html);
};

/**
 * Envía un correo de oferta/promoción a un suscriptor
 */
const sendPromotionalEmail = async (toEmail, offerDetails) => {
    const { title, description, discountCode, imageUrl } = offerDetails;
    const subject = `🎁 ${title} - Tech-Up`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .offer-image { width: 100%; max-width: 500px; height: auto; border-radius: 10px; margin: 20px 0; }
            .discount-code { background: #f093fb; color: white; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; margin: 20px 0; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔥 ${title}</h1>
            </div>
            <div class="content">
                ${imageUrl ? `<img src="${imageUrl}" alt="Oferta" class="offer-image" />` : ""}
                <p>${description}</p>
                ${discountCode ? `
                <div class="discount-code">
                    ${discountCode}
                </div>
                <p style="text-align: center;">Usa este código al finalizar tu compra</p>
                ` : ""}
                <center>
                    <a href="http://localhost:5500/index.html" class="button">Ver Productos</a>
                </center>
                <p style="color: #777; font-size: 12px; margin-top: 30px;">Esta oferta es exclusiva para suscriptores de Tech-Up Elite.</p>
            </div>
        </div>
    </body>
    </html>
  `;

    return await sendEmail(toEmail, subject, html);
};

// Exportamos todas las funciones necesarias
module.exports = {
    sendEmail, // La genérica (por si la necesitas en otro lado)
    sendWelcomeEmail,
    sendAdminNotification,
    sendPromotionalEmail,
};