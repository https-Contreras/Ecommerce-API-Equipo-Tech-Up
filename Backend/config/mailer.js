const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

/**
 * Configura el transporter de Nodemailer para usar Gmail
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
        return null; // Retorna null para que no truene
    }

    // 2. Creamos el transporter usando el servicio de Gmail
    transporter = nodemailer.createTransport({
        service: 'gmail', // Usamos el servicio pre-configurado de Gmail
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER, // Tu correo de Gmail
            pass: process.env.MAIL_PASS  // Tu App Password de 16 letras
        },
    });
    
    return transporter;
}

/**
 * Función "chidota" para enviar el correo
 * @param {string} to - El email del destinatario
 * @param {string} subject - El asunto
 * @param {string} html - El cuerpo del correo en HTML
 */
exports.sendEmail = async (to, subject, html) => {
    try {
        const mailTransporter = setupMailer();
        
        // Si el setup falló (ej. faltan credenciales), no hagas nada
        if (!mailTransporter) {
            console.log("Envío de correo omitido: Mailer no configurado.");
            return;
        }

        const info = await mailTransporter.sendMail({
            from: `"Tech-Up" <${process.env.MAIL_USER}>`, // De: (Usa tu propio correo)
            to: to, // Para:
            subject: subject, // Asunto
            html: html, // Cuerpo
        });

        console.log("Correo real enviado con éxito. ID:", info.messageId);
        
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
};