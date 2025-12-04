// Frontend/js/main.js

/**
 * MAIN.JS
 * Lógica principal de la página de productos
 * ACTUALIZADO: Ahora integra con el backend del carrito
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarContadorCarrito();

    const filtroCategoria = document.getElementById('filter-categoria');
    const filtroPrecio = document.getElementById('filter-precio');
    const filtroOferta = document.getElementById('filter-oferta');

    function handleFilterChange() {
        const filtros = {};
        if (filtroCategoria && filtroCategoria.value !== 'all') filtros.categoria = filtroCategoria.value;
        if (filtroPrecio && filtroPrecio.value !== 'all') filtros.precio = filtroPrecio.value;
        if (filtroOferta && filtroOferta.checked) filtros.oferta = 'true';
        cargarProductos(filtros);
    }

    if (filtroCategoria) filtroCategoria.addEventListener('change', handleFilterChange);
    if (filtroPrecio) filtroPrecio.addEventListener('change', handleFilterChange);
    if (filtroOferta) filtroOferta.addEventListener('change', handleFilterChange);
});

async function cargarContadorCarrito() {
    const token = localStorage.getItem('userToken');
    const cartCount = document.getElementById('cart-count');
    
    if (!token || !cartCount) {
        if (cartCount) cartCount.textContent = '0';
        return;
    }
    
    try {
        const response = await fetch('https://tech-up.westus2.cloudapp.azure.com:3000/api/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            cartCount.textContent = data.data.resumen.cantidadItems || 0;
        }
    } catch (error) {
        console.log('No se pudo cargar el contador del carrito');
    }
}

async function cargarProductos(filtros = {}) {
    const productListElement = document.getElementById('product-list');
    if (!productListElement) return;

    try {
        const url = new URL('https://tech-up.westus2.cloudapp.azure.com:3000/tech-up/api/products');
        if (filtros.categoria) url.searchParams.append('categoria', filtros.categoria);
        if (filtros.precio) url.searchParams.append('precio', filtros.precio);
        if (filtros.oferta) url.searchParams.append('oferta', filtros.oferta);

        const response = await fetch(url);
        const json = await response.json();

        if (json.success) {
            mostrarProductos(json.data);
        } else {
            productListElement.innerHTML = `<p>Error al cargar productos: ${json.message}</p>`;
        }

    } catch (error) {
        productListElement.innerHTML = '<p>No se pudo conectar con el servidor.</p>';
    }
}

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

        const precioNum = parseFloat(producto.precio);
        const stock = producto.stock !== undefined ? parseInt(producto.stock) : 0;
        const estaAgotado = stock <= 0;

        const etiquetaStock = estaAgotado 
            ? '<span style="color: #ff4d4d; font-weight: bold;">🚫 Agotado</span>' 
            : `<span style="color: var(--color-primary);">Stock: ${stock}</span>`;

        const attrDisabled = estaAgotado ? 'disabled' : '';
        const textoBoton = estaAgotado ? 'Sin Stock' : 'Agregar al carrito';
        const estiloBoton = estaAgotado ? 'opacity: 0.5; cursor: not-allowed;' : '';

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
                <button class="add-to-cart-btn" data-id="${producto.id}" ${attrDisabled} style="${estiloBoton}">${textoBoton}</button>
            </div>
        `;

        productListElement.appendChild(card);
    });

    agregarEventListenersCarrito();
}

function agregarEventListenersCarrito() {
    const botones = document.querySelectorAll('.add-to-cart-btn:not([disabled])');
    
    botones.forEach(btn => {
        btn.addEventListener('click', async () => {
            const productId = parseInt(btn.dataset.id);
            const textoOriginal = btn.textContent;
            btn.textContent = 'Agregando...';
            btn.disabled = true;
            
            await agregarAlCarritoDesdeProductos(productId);
            
            setTimeout(() => {
                btn.textContent = textoOriginal;
                btn.disabled = false;
            }, 500);
        });
    });
}

async function agregarAlCarritoDesdeProductos(productId, cantidad = 1) {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
        const result = await Swal.fire({
            title: 'Inicia Sesión',
            text: 'Necesitas iniciar sesión para agregar productos al carrito',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Ir a Login',
            cancelButtonText: 'Cancelar',
            background: '#1a202c',
            color: '#e2e8f0'
        });
        if (result.isConfirmed) window.location.href = 'login.html';
        return false;
    }
    
    try {
        const response = await fetch('https://tech-up.westus2.cloudapp.azure.com:3000/api/cart/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, cantidad })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                cartCount.textContent = data.data.resumen.cantidadItems;
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => { cartCount.style.transform = 'scale(1)'; }, 200);
            }
            
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#1a202c',
                color: '#e2e8f0'
            }).fire({ icon: 'success', title: data.message });
            
            return true;
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message || 'No se pudo agregar al carrito',
                icon: 'error',
                background: '#1a202c',
                color: '#e2e8f0'
            });
            return false;
        }
        
    } catch (error) {
        Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
            icon: 'error',
            background: '#1a202c',
            color: '#e2e8f0'
        });
        return false;
    }
}

window.agregarAlCarrito = agregarAlCarritoDesdeProductos;
console.log('✅ main.js cargado con integración de carrito');