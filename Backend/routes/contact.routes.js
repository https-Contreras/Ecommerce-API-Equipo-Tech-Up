
const express = require('express');
const router = express.Router();
const { verifyCaptcha } = require('../middleware/captcha.middleware');
const userController=require("../controllers/userController")
// Ruta para procesar formulario de contacto (CON verificación de CAPTCHA)
router.post('/contact', verifyCaptcha,userController.contact);
module.exports=router;