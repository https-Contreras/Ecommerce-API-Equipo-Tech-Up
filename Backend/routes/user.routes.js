const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST /tech-up/users/login - Autenticación de usuarios
router.post("/login", userController.login);

// Aquí irán más rutas de usuarios cuando tengas BD:
// router.post("/register", userController.register);
// router.get("/:id", userController.getUserById);
// router.put("/:id", userController.updateUser);
// etc.

module.exports = router;
