const pool = require('../db/db');
const mailer = require('../config/mailer');
const PDFDocument = require('pdfkit');
const path = require('path');

exports.createOrder = async (req, res) => {
    try {
        const { items, shippingData, total, metodoPago } = req.body;
        
        // Si el carrito está vacío, bye
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito está vacío" });
        }

        const [orderResult] = await pool.execute(
            'INSERT INTO orders (total) VALUES (?)',
            [total]
        );
        const orderId = orderResult.insertId;
        
        // 2. RESTAR INVENTARIO (Esto sí afecta la BD de productos)
        for (const item of items) {
            // Solo actualizamos el stock del producto
            await pool.execute(
                'UPDATE productos SET stock = stock - ? WHERE product_id = ?',
                [item.cantidad, item.id]
            );
        }

        // 3. GENERAR EL PDF EN MEMORIA
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));

        // --- LOGO DE LA EMPRESA ---
        // __dirname es la carpeta 'controllers'. Subimos a 'Backend' y entramos a 'public/images'
        const logoPath = path.join(__dirname, '../public/images/logo.png');

        // Intentamos poner el logo (Try/Catch para que no truene si falta la imagen)
        try {
            // (ruta, x, y, opciones)
            doc.image(logoPath, 50, 45, { width: 50 });
        } catch (error) {
            console.error("No se encontró el logo:", error.message);
        }

        // --- ENCABEZADO ---
        doc.fillColor('#444444')
           .fontSize(20)
           .text('Tech-Up', 110, 57) // Movemos el título a la derecha del logo (x=110)
           .text('El futuro del cómputo, ahora',110,80 )
           .fontSize(10)
           .text('Tech-Up S.A. de C.V.', 200, 50, { align: 'right' })
           .text('Aguascalientes, Ags.', 200, 65, { align: 'right' })
           .moveDown();

        doc.text('--------------------------------------------------------------------------', 50, 98);
        
        // --- DATOS DE LA ORDEN ---
        doc.fillColor('#000000').fontSize(20).text('Nota de Compra', 50, 130);
        
        // Columna Izquierda
        doc.fontSize(10).text(`Orden #: ${orderId}`, 50, 160);
        doc.text(`Fecha: ${new Date().toLocaleString()}`, 50, 175);
        doc.text(`Método de Pago: ${metodoPago ? metodoPago.toUpperCase() : 'OTROS'}`, 50, 190);

        // Columna Derecha (Cliente)
        doc.text(`Cliente: ${shippingData.nombre}`, 300, 160);
        doc.text(`Email: ${shippingData.email}`, 300, 175);
        doc.text(`Dirección:`, 300, 190);
        doc.font('Helvetica-Oblique').text(shippingData.direccion, 300, 205, { width: 250 });
        doc.font('Helvetica'); // Reset fuente

        doc.text('--------------------------------------------------------------------------', 50, 250);

        // --- TABLA DE PRODUCTOS ---
        let y = 270;
        
        // Encabezados de tabla
        doc.font('Helvetica-Bold');
        doc.text('Producto', 50, y);
        doc.text('Cant.', 300, y);
        doc.text('Precio Unit.', 380, y);
        doc.text('Total', 480, y, { width: 60, align: 'right' });
        doc.font('Helvetica');
        
        y += 25; // Espacio después del encabezado

        items.forEach(item => {
            const subtotal = parseFloat(item.precio) * parseInt(item.cantidad);
            
            // Nombre del producto (recortado si es muy largo)
            doc.text(item.nombre.substring(0, 45), 50, y);
            
            // Cantidad
            doc.text(item.cantidad.toString(), 300, y);
            
            // Precio Unitario
            doc.text(`$${parseFloat(item.precio).toFixed(2)}`, 380, y);
            
            // Total por item
            doc.text(`$${subtotal.toFixed(2)}`, 480, y, { width: 60, align: 'right' });
            
            y += 20; // Siguiente fila
        });

        // Línea final
        doc.text('--------------------------------------------------------------------------', 50, y);
        y += 20;

        // --- TOTAL GENERAL ---
        doc.fontSize(14).font('Helvetica-Bold').text(`TOTAL PAGADO: $${parseFloat(total).toFixed(2)}`, 300, y, { align: 'right' });
        
        // Pie de página
        doc.fontSize(10).font('Helvetica').text('Gracias por tu compra.', 50, 700, { align: 'center', width: 500 });
        
        doc.end(); 
        // ---------------------

        // 4. ENVIAR EL CORREO
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            const htmlBody = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #00e5ff;">¡Gracias por tu compra, ${shippingData.nombre}!</h1>
                    <p>Tu pedido <strong>#${orderId}</strong> ha sido confirmado exitosamente.</p>
                    <p>Adjunto encontrarás tu nota de compra en formato PDF.</p>
                    <hr>
                    <p>Atentamente,<br>El equipo de Tech-Up</p>
                </div>
            `;

            await mailer.sendEmail(
                shippingData.email, 
                `Nota de Compra #${orderId} - Tech-Up`, 
                htmlBody,
                [{ filename: `Nota_Compra_${orderId}.pdf`, content: pdfData }]
            );
        });
        // 5. RESPONDER AL FRONTEND
        res.status(201).json({
            success: true,
            message: "Orden procesada y nota enviada (Sin guardar en historial)",
            orderId: orderId
        });

    } catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).json({ success: false, message: "Error al procesar la orden en el servidor" });
    }
};