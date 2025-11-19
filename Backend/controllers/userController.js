/**
 * Controlador de usuarios
 * Maneja autenticación y gestión de usuarios
 */

/**
 * Controlador de login
 * POST /tech-up/users/login
 */
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    console.log("🔐 Intento de login:", email);

    // TODO: Aquí irá la lógica real de autenticación con BD
    // Por ahora es solo una respuesta de prueba

    res.status(200).json({
      success: true,
      message: "Login exitoso (simulado)",
      data: {
        email: email,
        // En producción aquí irían: token, userId, etc.
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar login",
      error: error.message,
    });
  }
};
