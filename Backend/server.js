// Backend/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const userRoutes = require("./routes/user.routes");
const paymentRoutes = require("./routes/payment.routes");
const contactRoutes = require("./routes/contact.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const promotionRoutes = require("./routes/promotion.routes");
const productRoutes = require("./routes/product.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes"); // ← NUEVO: Rutas del carrito

const app = express();
const ALLOWED_ORIGINS = ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get("/tech-up/test", (req, res) => {
  res.json({
    message: "¡Bienvenido a la API de Tech-Up!",
    success: true,
  });
});

// 👤 Rutas de usuarios CON CAPTCHA
app.use("/tech-up/users", userRoutes);

// Rutas de admin
app.use("/tech-up/api/admin", adminRoutes);

//Rutas de pagos CON CAPTCHA
app.use("/tech-up", paymentRoutes);

// Rutas para subscripciones
app.use("/tech-up/subscriptions", subscriptionRoutes);
app.use("/tech-up/promotions", promotionRoutes);

// Rutas de productos (públicas)
app.use("/tech-up/api/products", productRoutes);

//Rutas del carrito
app.use("/api/cart", cartRoutes);

// Rutas de contacto CON CAPTCHA
app.use("/tech-up", contactRoutes);

// Servir imágenes estáticas
app.use('/images', express.static('public/images'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});