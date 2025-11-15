// 📁 Frontend/js/carrito.js

document.addEventListener('DOMContentLoaded', () => {
    const cartListElement = document.getElementById('cart-items-list');
    
    if (!cartListElement) return;

    cargarCarrito();
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', abrirModalPago);
    }
});

async function cargarCarrito() {
    const carritoSimulado = [
        {
            id: 1,
            nombre: "Laptop Gamer Avanzada",
            precio: 48500.00,
            imagen: "http://localhost:3000/images/laptop-gamer.png",
            cantidad: 1
        },
        {
            id: 4,
            nombre: "Teclado Mecánico RGB",
            precio: 3100.00,
            imagen: "http://localhost:3000/images/teclado-mecanico.png",
            cantidad: 2
        }
    ];
    
    mostrarItemsCarrito(carritoSimulado);
    actualizarTotales(carritoSimulado);
}

function mostrarItemsCarrito(carrito) {
    const cartListElement = document.getElementById('cart-items-list');
    cartListElement.innerHTML = '';

    if (carrito.length === 0) {
        cartListElement.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        const subtotalItem = item.precio * item.cantidad;

        itemElement.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.nombre}</h4>
                <p class="cart-item-price">$${item.precio.toFixed(2)}</p>
                <button class="cart-item-remove" data-id="${item.id}">Eliminar</button>
            </div>
            <div class="cart-item-controls">
                <label for="qty-${item.id}">Cantidad:</label>
                <input type="number" id="qty-${item.id}" class="cart-item-qty" value="${item.cantidad}" min="1" data-id="${item.id}">
                <p class="cart-item-subtotal">Subtotal: $${subtotalItem.toFixed(2)}</p>
            </div>
        `;
        cartListElement.appendChild(itemElement);
    });
}

function actualizarTotales(carrito) {
    const subtotal = carrito.reduce((acc, item) => {
        return acc + (item.precio * item.cantidad);
    }, 0);

    const total = subtotal;

    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

// ============ FUNCIONES PARA EL MODAL DE PAGO ============

let captchaWidgets = {
    tarjeta: null,
    transferencia: null,
    oxxo: null
};

function abrirModalPago() {
    const total = document.getElementById('summary-total').textContent;
    
    const modalHTML = `
        <div id="payment-modal" class="payment-modal">
            <div class="payment-modal-content">
                <span class="close-modal">&times;</span>
                
                <h2>Método de Pago</h2>
                <p class="payment-total">Total a pagar: <strong>${total}</strong></p>
                
                <div class="payment-method-selector">
                    <button type="button" class="payment-method-btn active" data-method="tarjeta">
                        💳 Tarjeta
                    </button>
                    <button type="button" class="payment-method-btn" data-method="transferencia">
                        🏦 Transferencia
                    </button>
                    <button type="button" class="payment-method-btn" data-method="oxxo">
                        🏪 OXXO
                    </button>
                </div>
                
                <!-- Formulario de Tarjeta -->
                <form id="payment-form-tarjeta" class="payment-form active">
                    <div class="form-group">
                        <label for="card-number">Número de Tarjeta</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="card-name">Nombre del Titular</label>
                        <input type="text" id="card-name" placeholder="JUAN PÉREZ" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-expiry">Fecha de Expiración</label>
                            <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="card-cvv">CVV</label>
                            <input type="text" id="card-cvv" placeholder="123" maxlength="4" required>
                        </div>
                    </div>
                    
                    <div class="form-group captcha-group">
                        <div id="captcha-tarjeta"></div>
                    </div>
                    
                    <button type="submit" class="submit-btn payment-submit-btn">
                        Confirmar Pago
                    </button>
                </form>
                
                <!-- Formulario de Transferencia -->
                <form id="payment-form-transferencia" class="payment-form">
                    <div class="payment-info-box">
                        <h3>📋 Datos para Transferencia</h3>
                        <div class="info-item"><strong>Banco:</strong> <span>BBVA Bancomer</span></div>
                        <div class="info-item"><strong>CLABE:</strong> <span>012180001234567890</span></div>
                        <div class="info-item"><strong>Cuenta:</strong> <span>0123456789</span></div>
                        <div class="info-item"><strong>Titular:</strong> <span>Tech-Up S.A. de C.V.</span></div>
                        <div class="info-item"><strong>Concepto:</strong> <span>Pago Pedido #${generarNumeroPedido()}</span></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="transfer-bank">Tu Banco</label>
                        <select id="transfer-bank" required>
                            <option value="">Selecciona tu banco</option>
                            <option value="bbva">BBVA</option>
                            <option value="banamex">Banamex</option>
                            <option value="santander">Santander</option>
                            <option value="hsbc">HSBC</option>
                            <option value="scotiabank">Scotiabank</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="transfer-account">Titular de la Cuenta</label>
                        <input type="text" id="transfer-account" placeholder="Nombre completo" required>
                    </div>
                    
                    <div class="form-group captcha-group">
                        <div id="captcha-transferencia"></div>
                    </div>
                    
                    <button type="submit" class="submit-btn payment-submit-btn">
                        Confirmar Transferencia
                    </button>
                </form>
                
                <!-- Formulario de OXXO -->
                <form id="payment-form-oxxo" class="payment-form">
                    <div class="payment-info-box oxxo-box">
                        <h3>🏪 Paga en OXXO</h3>
                        <p class="oxxo-instructions">Presenta este código en cualquier tienda OXXO para completar tu pago.</p>
                        
                        <div class="oxxo-code">
                            <strong>Código de Referencia:</strong>
                            <div class="reference-code">${generarCodigoOxxo()}</div>
                        </div>
                        
                        <div class="info-item"><strong>Monto a pagar:</strong> <span class="oxxo-amount">${total}</span></div>
                        <div class="info-item"><strong>Válido hasta:</strong> <span>${obtenerFechaExpiracion()}</span></div>
                    </div>
                    
                    <div class="oxxo-steps">
                        <h4>Instrucciones:</h4>
                        <ol>
                            <li>Acude a cualquier tienda OXXO</li>
                            <li>Indica que quieres realizar un pago de servicio</li>
                            <li>Dicta el código de referencia al cajero</li>
                            <li>Realiza el pago en efectivo</li>
                            <li>Conserva tu comprobante</li>
                        </ol>
                    </div>
                    
                    <div class="form-group captcha-group">
                        <div id="captcha-oxxo"></div>
                    </div>
                    
                    <button type="submit" class="submit-btn payment-submit-btn">
                        Confirmar Pedido
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('payment-modal');
    const closeBtn = document.querySelector('.close-modal');
    const methodButtons = document.querySelectorAll('.payment-method-btn');
    const forms = document.querySelectorAll('.payment-form');
    
    setTimeout(() => renderizarCaptcha('tarjeta'), 100);
    
    closeBtn.addEventListener('click', cerrarModalPago);
    window.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModalPago();
    });
    
    methodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.dataset.method;
            methodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `payment-form-${method}`) {
                    form.classList.add('active');
                }
            });
            
            renderizarCaptcha(method);
        });
    });
    
    // Formatear inputs
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cvvInput = document.getElementById('card-cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    forms.forEach(form => {
        form.addEventListener('submit', procesarPago);
    });
}

function renderizarCaptcha(metodo) {
    if (captchaWidgets[metodo] !== null) return;
    
    if (typeof grecaptcha === 'undefined' || !grecaptcha.render) {
        console.error('reCAPTCHA no está cargado');
        return;
    }
    
    const containerId = `captcha-${metodo}`;
    const container = document.getElementById(containerId);
    
    if (!container || container.children.length > 0) return;
    
    try {
        captchaWidgets[metodo] = grecaptcha.render(containerId, {
            'sitekey': '6Le84A0sAAAAAFllLkm3fs8hIY90-EZp6yQOfCL0'
        });
    } catch (error) {
        console.error(`Error al renderizar CAPTCHA para ${metodo}:`, error);
    }
}

function cerrarModalPago() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        captchaWidgets = { tarjeta: null, transferencia: null, oxxo: null };
        modal.remove();
    }
}

// 🔐 FUNCIÓN ACTUALIZADA: Ahora envía al backend
function procesarPago(e) {
    e.preventDefault();
    
    const formId = e.target.id;
    const metodo = formId.replace('payment-form-', '');
    const widgetId = captchaWidgets[metodo];
    
    if (widgetId === null) {
        alert('⚠️ Error: CAPTCHA no inicializado correctamente.');
        return;
    }
    
    // 1️⃣ Obtener token del CAPTCHA
    let captchaToken;
    try {
        captchaToken = grecaptcha.getResponse(widgetId);
    } catch (error) {
        console.error('Error al obtener respuesta del CAPTCHA:', error);
        alert('⚠️ Error al validar el CAPTCHA. Por favor, recarga la página.');
        return;
    }
    
    if (!captchaToken) {
        alert('⚠️ Por favor, completa el CAPTCHA antes de continuar con el pago.');
        return;
    }
    
    const submitBtn = e.target.querySelector('.payment-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Procesando...';
    submitBtn.disabled = true;
    
    // 2️⃣ Recopilar datos del formulario
    const datos = recopilarDatosCompra(metodo);
    const total = document.getElementById('summary-total').textContent;
    
    // 3️⃣ Enviar al servidor CON el token del CAPTCHA
    fetch('http://localhost:3000/tech-up/procesar-pago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            captchaToken: captchaToken,  // ⭐ TOKEN DEL CAPTCHA
            metodo: metodo,
            datos: datos,
            total: total
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let mensaje = '';
            switch(metodo) {
                case 'tarjeta':
                    mensaje = `¡Pago con tarjeta procesado exitosamente! 🎉\n\nOrden #${data.ordenId}\nGracias por tu compra en Tech-Up.`;
                    break;
                case 'transferencia':
                    mensaje = `¡Transferencia registrada! 💰\n\nOrden #${data.ordenId}\nRecibirás un email de confirmación cuando se acredite el pago.`;
                    break;
                case 'oxxo':
                    mensaje = `¡Pedido confirmado! 🏪\n\nOrden #${data.ordenId}\nRecuerda realizar el pago en OXXO dentro de las próximas 48 horas.`;
                    break;
            }
            
            alert(mensaje);
            cerrarModalPago();
            
            // Limpiar carrito
            document.getElementById('cart-items-list').innerHTML = '<p>Tu carrito está vacío.</p>';
            document.getElementById('summary-subtotal').textContent = '$0.00';
            document.getElementById('summary-total').textContent = '$0.00';
        } else {
            // ❌ El servidor rechazó el pago
            alert('⚠️ ' + data.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            grecaptcha.reset(widgetId);
        }
    })
    .catch(error => {
        console.error('Error al procesar pago:', error);
        alert('❌ Error al procesar el pago. Por favor, intenta de nuevo.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        grecaptcha.reset(widgetId);
    });
}

function recopilarDatosCompra(metodo) {
    const datos = {};
    
    if (metodo === 'tarjeta') {
        datos.numeroTarjeta = document.getElementById('card-number').value;
        datos.nombreTitular = document.getElementById('card-name').value;
        datos.expiracion = document.getElementById('card-expiry').value;
        datos.cvv = document.getElementById('card-cvv').value;
    } else if (metodo === 'transferencia') {
        datos.banco = document.getElementById('transfer-bank').value;
        datos.titular = document.getElementById('transfer-account').value;
    }
    
    return datos;
}

function generarNumeroPedido() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generarCodigoOxxo() {
    const chars = '0123456789';
    let codigo = '';
    for (let i = 0; i < 14; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i === 3 || i === 7 || i === 11) codigo += ' ';
    }
    return codigo;
}

function obtenerFechaExpiracion() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    return fecha.toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
}