// Backend/routes/cart.routes.js

/**
 * CART ROUTES
 * Rutas para el carrito de compras
 * 
 * Todas las rutas requieren autenticación (verifyToken)
 * Base path: /api/cart
 */

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/adminMiddleware");

// ============================================
// RUTAS DEL CARRITO (Requieren login)
// ============================================

// GET /api/cart - Obtiene el carrito del usuario logueado
router.get("/", verifyToken, cartController.getCart);

// POST /api/cart/add - Agrega un producto al carrito
router.post("/add", verifyToken, cartController.addToCart);

// PUT /api/cart/update - Modifica la cantidad de un producto
router.put("/update", verifyToken, cartController.updateCartItem);

// DELETE /api/cart/remove - Quita un producto del carrito
router.delete("/remove", verifyToken, cartController.removeFromCart);

// POST /api/cart/apply-coupon - Aplica un cupón de descuento
router.post("/apply-coupon", verifyToken, cartController.applyCoupon);

// DELETE /api/cart/remove-coupon - Elimina el cupón aplicado
router.delete("/remove-coupon", verifyToken, cartController.removeCoupon);

// DELETE /api/cart/clear - Vacía el carrito completamente
router.delete("/clear", verifyToken, cartController.clearCart);

// GET /api/cart/coupons - Lista cupones disponibles (para testing)
router.get("/coupons", cartController.getAvailableCoupons);

module.exports = router;