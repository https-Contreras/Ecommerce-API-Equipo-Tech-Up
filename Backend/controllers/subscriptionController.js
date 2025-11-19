const emailService = require("../services/emailService");
const { addSubscription, isSubscribed, getAllSubscriptions, getTotalSubscriptions } = require("../data/subscriptions");

/**
 * Controlador para manejar nuevas suscripciones al newsletter
 * POST /tech-up/subscriptions
 */
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validar que el email venga en la petición
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico es requerido",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato del correo electrónico no es válido",
      });
    }

    // Verificar si ya está suscrito
    if (isSubscribed(email)) {
      return res.status(400).json({
        success: false,
        message: "Este correo ya está suscrito a nuestro newsletter",
      });
    }

    console.log(`📧 Nueva suscripción: ${email}`);

    // Guardar suscripción en "base de datos" (simulada)
    const newSubscription = addSubscription(email);

    // Enviar correo de bienvenida al usuario
    await emailService.sendWelcomeEmail(email);

    // Enviar notificación al admin
    await emailService.sendAdminNotification(email);

    res.status(201).json({
      success: true,
      message: "¡Suscripción exitosa! Revisa tu correo.",
      data: {
        email: newSubscription.email,
        fechaSuscripcion: newSubscription.fechaSuscripcion
      }
    });

  } catch (error) {
    console.error("❌ Error en suscripción:", error);
    res.status(500).json({
      success: false,
      message: "Hubo un error al procesar tu suscripción. Intenta de nuevo.",
      error: error.message,
    });
  }
};

/**
 * Obtiene todas las suscripciones (para admin)
 * GET /tech-up/subscriptions
 */
exports.getAllSubscriptions = (req, res) => {
  try {
    const subscriptions = getAllSubscriptions();

    console.log(`📋 Suscripciones solicitadas - Total: ${subscriptions.length}`);

    res.status(200).json({
      success: true,
      total: subscriptions.length,
      data: subscriptions
    });

  } catch (error) {
    console.error("❌ Error al obtener suscripciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las suscripciones",
      error: error.message
    });
  }
};

/**
 * Obtiene estadísticas de suscripciones
 * GET /tech-up/subscriptions/stats
 */
exports.getSubscriptionStats = (req, res) => {
  try {
    const total = getTotalSubscriptions();
    const subscriptions = getAllSubscriptions();

    // Calcular suscripciones por mes (últimos 6 meses)
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    const recentSubscriptions = subscriptions.filter(
      sub => new Date(sub.fechaSuscripcion) >= sixMonthsAgo
    );

    console.log(`📊 Estadísticas de suscripciones solicitadas`);

    res.status(200).json({
      success: true,
      data: {
        totalSuscriptores: total,
        suscripcionesRecientes: recentSubscriptions.length,
        ultimaSuscripcion: subscriptions.length > 0 
          ? subscriptions[subscriptions.length - 1].fechaSuscripcion 
          : null
      }
    });

  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};