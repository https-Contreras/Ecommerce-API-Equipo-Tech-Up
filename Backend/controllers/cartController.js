// Backend/controllers/cartController.js

/**
 * CART CONTROLLER
 * Maneja la lógica del carrito de compras
 * 
 * NOTA: El carrito se almacena en memoria (objeto JS) asociado al ID del usuario.
 * Los cupones están hardcodeados.
 * En producción, esto debería ir a base de datos.
 */

const productModel = require('../model/productModel');

// ============================================
// ALMACENAMIENTO EN MEMORIA (Simulado)
// ============================================

// Estructura: { odUserId: { items: [...], coupon: null } }
const carts = {};

// Cupones hardcodeados
const CUPONES_VALIDOS = {
    'WELCOME10': { descuento: 10, tipo: 'porcentaje', descripcion: '10% de descuento' },
    'TECHUP20': { descuento: 20, tipo: 'porcentaje', descripcion: '20% de descuento' },
    'DESCUENTO50': { descuento: 50, tipo: 'fijo', descripcion: '$50 de descuento' },
    'ENVIOGRATIS': { descuento: 0, tipo: 'envio', descripcion: 'Envío gratis' },
    'BLACKFRIDAY': { descuento: 25, tipo: 'porcentaje', descripcion: '25% de descuento Black Friday' }
};

// Costo de envío base
const COSTO_ENVIO = 150;

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Obtiene o inicializa el carrito de un usuario
 */
function getOrCreateCart(userId) {
    if (!carts[userId]) {
        carts[userId] = {
            items: [],
            coupon: null
        };
    }
    return carts[userId];
}

/**
 * Calcula el resumen del carrito (subtotal, descuento, envío, total)
 */
function calcularResumen(cart) {
    // Subtotal: suma de (precio * cantidad) de cada item
    const subtotal = cart.items.reduce((acc, item) => {
        return acc + (item.precio * item.cantidad);
    }, 0);

    let descuento = 0;
    let envio = cart.items.length > 0 ? COSTO_ENVIO : 0;
    let mensajeCupon = null;

    // Si hay cupón aplicado, calculamos el descuento
    if (cart.coupon) {
        const cuponData = CUPONES_VALIDOS[cart.coupon];
        
        if (cuponData) {
            mensajeCupon = cuponData.descripcion;
            
            switch (cuponData.tipo) {
                case 'porcentaje':
                    descuento = subtotal * (cuponData.descuento / 100);
                    break;
                case 'fijo':
                    descuento = cuponData.descuento;
                    break;
                case 'envio':
                    envio = 0; // Envío gratis
                    break;
            }
        }
    }

    // El descuento no puede ser mayor al subtotal
    descuento = Math.min(descuento, subtotal);

    const total = subtotal - descuento + envio;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        descuento: Number(descuento.toFixed(2)),
        envio: Number(envio.toFixed(2)),
        total: Number(total.toFixed(2)),
        cuponAplicado: cart.coupon,
        mensajeCupon: mensajeCupon,
        cantidadItems: cart.items.reduce((acc, item) => acc + item.cantidad, 0)
    };
}

// ============================================
// CONTROLADORES
// ============================================

/**
 * GET /api/cart
 * Obtiene el carrito del usuario logueado
 */
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId; // Viene del middleware verifyToken
        const cart = getOrCreateCart(userId);
        const resumen = calcularResumen(cart);

        res.status(200).json({
            success: true,
            data: {
                items: cart.items,
                resumen: resumen
            }
        });

    } catch (error) {
        console.error("❌ Error al obtener carrito:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el carrito",
            error: error.message
        });
    }
};

/**
 * POST /api/cart/add
 * Agrega un producto al carrito
 * Body: { productId: number, cantidad: number (opcional, default 1) }
 */
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, cantidad = 1 } = req.body;

        // Validaciones básicas
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "El ID del producto es requerido"
            });
        }

        if (cantidad < 1) {
            return res.status(400).json({
                success: false,
                message: "La cantidad debe ser al menos 1"
            });
        }

        // Verificar que el producto existe en la BD
        const producto = await productModel.getProductById(productId);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        // Verificar stock disponible
        if (producto.stock < cantidad) {
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`
            });
        }

        const cart = getOrCreateCart(userId);

        // Buscar si el producto ya está en el carrito
        const itemExistente = cart.items.find(item => item.productId === productId);

        if (itemExistente) {
            // Verificar que la nueva cantidad no exceda el stock
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            
            if (nuevaCantidad > producto.stock) {
                return res.status(400).json({
                    success: false,
                    message: `No puedes agregar más. Stock máximo: ${producto.stock}`
                });
            }

            itemExistente.cantidad = nuevaCantidad;
        } else {
            // Agregar nuevo item al carrito
            cart.items.push({
                productId: producto.id,
                product_id: producto.product_id, // ID string para referencia
                nombre: producto.nombre,
                precio: parseFloat(producto.precio),
                imagen: producto.imagen,
                cantidad: cantidad,
                stockDisponible: producto.stock
            });
        }

        const resumen = calcularResumen(cart);

        res.status(200).json({
            success: true,
            message: `${producto.nombre} agregado al carrito`,
            data: {
                items: cart.items,
                resumen: resumen
            }
        });

    } catch (error) {
        console.error("❌ Error al agregar al carrito:", error);
        res.status(500).json({
            success: false,
            message: "Error al agregar producto al carrito",
            error: error.message
        });
    }
};

/**
 * PUT /api/cart/update
 * Modifica la cantidad de un producto en el carrito
 * Body: { productId: number, cantidad: number }
 */
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, cantidad } = req.body;

        // Validaciones
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "El ID del producto es requerido"
            });
        }

        if (cantidad === undefined || cantidad === null) {
            return res.status(400).json({
                success: false,
                message: "La cantidad es requerida"
            });
        }

        const cart = getOrCreateCart(userId);
        
        // Buscar el item en el carrito
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado en el carrito"
            });
        }

        // Si la cantidad es 0 o menor, eliminamos el item
        if (cantidad <= 0) {
            const itemEliminado = cart.items.splice(itemIndex, 1)[0];
            const resumen = calcularResumen(cart);

            return res.status(200).json({
                success: true,
                message: `${itemEliminado.nombre} eliminado del carrito`,
                data: {
                    items: cart.items,
                    resumen: resumen
                }
            });
        }

        // Verificar stock actual del producto
        const producto = await productModel.getProductById(productId);
        
        if (producto && cantidad > producto.stock) {
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente. Máximo disponible: ${producto.stock}`
            });
        }

        // Actualizar cantidad
        cart.items[itemIndex].cantidad = cantidad;
        
        // Actualizar stock disponible en caso de que haya cambiado
        if (producto) {
            cart.items[itemIndex].stockDisponible = producto.stock;
        }

        const resumen = calcularResumen(cart);

        res.status(200).json({
            success: true,
            message: "Cantidad actualizada",
            data: {
                items: cart.items,
                resumen: resumen
            }
        });

    } catch (error) {
        console.error("❌ Error al actualizar carrito:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar el carrito",
            error: error.message
        });
    }
};

/**
 * DELETE /api/cart/remove
 * Quita un producto del carrito
 * Body: { productId: number }
 */
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "El ID del producto es requerido"
            });
        }

        const cart = getOrCreateCart(userId);
        
        // Buscar y eliminar el item
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado en el carrito"
            });
        }

        const itemEliminado = cart.items.splice(itemIndex, 1)[0];
        const resumen = calcularResumen(cart);

        res.status(200).json({
            success: true,
            message: `${itemEliminado.nombre} eliminado del carrito`,
            data: {
                items: cart.items,
                resumen: resumen
            }
        });

    } catch (error) {
        console.error("❌ Error al eliminar del carrito:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar producto del carrito",
            error: error.message
        });
    }
};

/**
 * POST /api/cart/apply-coupon
 * Aplica un cupón de descuento al carrito
 * Body: { code: string }
 */
exports.applyCoupon = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "El código del cupón es requerido"
            });
        }

        // Normalizar código (mayúsculas, sin espacios)
        const codigoNormalizado = code.toUpperCase().trim();

        // Verificar si el cupón existe
        if (!CUPONES_VALIDOS[codigoNormalizado]) {
            return res.status(400).json({
                success: false,
                message: "Cupón inválido o expirado"
            });
        }

        const cart = getOrCreateCart(userId);

        // Verificar que haya items en el carrito
        if (cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No puedes aplicar un cupón a un carrito vacío"
            });
        }

        // Aplicar el cupón
        cart.coupon = codigoNormalizado;
        const resumen = calcularResumen(cart);

        res.status(200).json({
            success: true,
            message: `¡Cupón "${codigoNormalizado}" aplicado! ${CUPONES_VALIDOS[codigoNormalizado].descripcion}`,
            data: {
                items: cart.items,
                resumen: resumen
            }
        });

    } catch (error) {
        console.error("❌ Error al aplicar cupón:", error);
        res.status(500).json({
            success: false,
            message: "Error al aplicar el cupón",
            error: error.message
        });
    }
};

/**
 * DELETE /api/cart/remove-coupon
 * Elimina el cupón aplicado
 */
exports.removeCoupon = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = getOrCreateCart(userId);

        if (!cart.coupon) {
            return res.status(400).json({
                success: false,
                message: "No hay cupón aplicado"
            });
        }

        cart.coupon = null;
        const resumen = calcularResumen(cart);

        res.status(200).json({
            success: true,
            message: "Cupón eliminado",
            data: {
                items: cart.items,
                resumen: resumen
            }
        });

    } catch (error) {
        console.error("❌ Error al eliminar cupón:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el cupón",
            error: error.message
        });
    }
};

/**
 * DELETE /api/cart/clear
 * Vacía completamente el carrito
 */
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Reiniciar el carrito
        carts[userId] = {
            items: [],
            coupon: null
        };

        res.status(200).json({
            success: true,
            message: "Carrito vaciado correctamente",
            data: {
                items: [],
                resumen: calcularResumen(carts[userId])
            }
        });

    } catch (error) {
        console.error("❌ Error al vaciar carrito:", error);
        res.status(500).json({
            success: false,
            message: "Error al vaciar el carrito",
            error: error.message
        });
    }
};

/**
 * GET /api/cart/coupons (Solo para testing/debug)
 * Lista los cupones disponibles
 */
exports.getAvailableCoupons = (req, res) => {
    const cuponesPublicos = Object.entries(CUPONES_VALIDOS).map(([code, data]) => ({
        code,
        descripcion: data.descripcion
    }));

    res.status(200).json({
        success: true,
        message: "Cupones disponibles (solo para testing)",
        data: cuponesPublicos
    });
};