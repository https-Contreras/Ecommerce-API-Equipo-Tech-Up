const express = require("express");
const router = express.Router();
// Importamos el controlador de productos (que ya tiene create, update, delete)
const productController = require("../controllers/productController");
// Importamos el controlador de suscripciones (para las stats)
const statsController= require("../controllers/statsController");

// Importamos los middlewares de seguridad
const { verifyToken, verifyAdmin } = require("../middleware/adminMiddleware");
const { verify } = require("jsonwebtoken");


// Crear Producto (POST /api/admin/products)
router.post("/products", verifyToken, verifyAdmin, productController.createProduct);

// Editar Producto (PUT /api/admin/products/:id)
router.put("/products/:id", verifyToken, verifyAdmin, productController.updateProduct);

// Eliminar Producto (DELETE /api/admin/products/:id)
router.delete("/products/:id", verifyToken, verifyAdmin, productController.deleteProduct);

//obtener estadisticas 
router.get("/dashboard-stats", verifyToken, verifyAdmin, statsController.getDashboardStats);


module.exports = router;