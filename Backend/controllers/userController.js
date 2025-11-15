exports.login = (req, res) => {
    console.log("Entró a login");
    console.log("Datos recibidos:", req.body);
    
    // Si llegó aquí, el CAPTCHA ya fue validado por el middleware ✅
    
    const { email, password } = req.body;
    
    // Aquí irá tu lógica de validación de usuario/contraseña
    // Por ahora solo respuesta de prueba:
    
    res.status(200).json({ 
        success: true,
        message: "Login exitoso (y CAPTCHA validado)" 
    });
};

exports.register = (req, res) => {
    console.log("Entró a register");
    console.log("Datos recibidos:", req.body);
    
    // El CAPTCHA ya fue validado ✅
    
    const { nombre, email, password } = req.body;
    
    res.status(200).json({ 
        success: true,
        message: "Registro exitoso (y CAPTCHA validado)" 
    });
};
