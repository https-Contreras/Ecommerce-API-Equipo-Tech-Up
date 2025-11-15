const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyCaptcha } = require('../middleware/captcha.middleware'); // ← Ruta correcta

// Login con CAPTCHA
router.post("/login", verifyCaptcha, userController.login);

// Registro con CAPTCHA (cuando lo hagas)
router.post('/register', verifyCaptcha, userController.register);

module.exports = router;