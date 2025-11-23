document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cargar productos al iniciar (sin filtros)
    cargarProductos();

    // ##### SECCIÓN DE FILTROS #####
    const filtroCategoria = document.getElementById('filter-categoria');
    const filtroPrecio = document.getElementById('filter-precio');
    const filtroOferta = document.getElementById('filter-oferta');

    // Función que lee los inputs y recarga los productos
    function handleFilterChange() {
        const filtros = {};

        // Solo agregamos al objeto si tienen valor
        if (filtroCategoria && filtroCategoria.value !== 'all') {
            filtros.categoria = filtroCategoria.value;
        }
        
        if (filtroPrecio && filtroPrecio.value !== 'all') {
            filtros.precio = filtroPrecio.value;
        }

        if (filtroOferta && filtroOferta.checked) {
            filtros.oferta = 'true';
        }

        console.log("Recargando con filtros:", filtros);
        cargarProductos(filtros);
    }

    // Listeners
    if (filtroCategoria) filtroCategoria.addEventListener('change', handleFilterChange);
    if (filtroPrecio) filtroPrecio.addEventListener('change', handleFilterChange);
    if (filtroOferta) filtroOferta.addEventListener('change', handleFilterChange);
});


/**
 * 2. Carga los productos desde la API REAL
 * @param {Object} filtros - Objeto con { categoria, precio, oferta }
 */
async function cargarProductos(filtros = {}) {
    
    const productListElement = document.getElementById('product-list');
    if (!productListElement) return; // Si no estamos en la página de productos, salir.

    try {
        
        const url = new URL('http://localhost:3000/tech-up/api/products');
        
        // Agregamos los filtros a la URL de forma segura
        if (filtros.categoria) url.searchParams.append('categoria', filtros.categoria);
        if (filtros.precio) url.searchParams.append('precio', filtros.precio);
        if (filtros.oferta) url.searchParams.append('oferta', filtros.oferta);

        
        const response = await fetch(url);
        const json = await response.json();

        if (json.success) {
            // json.data es el array de productos que viene de MySQL
            mostrarProductos(json.data);
        } else {
            console.error('Error del backend:', json.message);
            productListElement.innerHTML = `<p>Error al cargar productos: ${json.message}</p>`;
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        productListElement.innerHTML = '<p>No se pudo conectar con el servidor.</p>';
    }
}

/**
 * 3. Dibuja los productos y reactiva los botones del carrito
 */
function mostrarProductos(productos) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';

    if (productos.length === 0) {
        productListElement.innerHTML = '<h3 style="width:100%; text-align:center;">No se encontraron productos con esos filtros.</h3>';
        return;
    }

    productos.forEach(producto => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        // Aseguramos que el precio sea número
        const precioNum = parseFloat(producto.precio);
        
        // --- LÓGICA DE STOCK ---
        const stock = producto.stock !== undefined ? parseInt(producto.stock) : 0;
        const estaAgotado = stock <= 0;

        // Variables visuales según el stock
        const etiquetaStock = estaAgotado 
            ? '<span style="color: #ff4d4d; font-weight: bold;">🚫 Agotado</span>' 
            : `<span style="color: var(--color-primary);">Stock: ${stock}</span>`;

        const attrDisabled = estaAgotado ? 'disabled' : '';
        const textoBoton = estaAgotado ? 'Sin Stock' : 'Agregar al carrito';
        
        // Estilo inline para apagar el botón si no hay stock (opcional, pero se ve mejor)
        const estiloBoton = estaAgotado ? 'opacity: 0.5; cursor: not-allowed; border-color: #555; color: #aaa;' : '';

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${producto.imagen || 'assets/images/placeholder.jpg'}" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion || ''}</p>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                    <p class="product-price">$${precioNum.toFixed(2)}</p>
                    <p style="font-size: 0.9rem;">${etiquetaStock}</p>
                </div>
                
                <button class="add-to-cart-btn" 
                    data-id="${producto.id}"
                    data-nombre="${producto.nombre}"
                    data-precio="${precioNum}"
                    data-imagen="${producto.imagen || 'assets/images/placeholder.jpg'}"
                    ${attrDisabled} 
                    style="${estiloBoton}">
                    ${textoBoton}
                </button>
            </div>
        `;

        productListElement.appendChild(card);
    });
};