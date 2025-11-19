// 1. Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // Llama a la función principal para cargar y mostrar productos
    cargarProductos();
    
    
    // ##### INICIO DE LA SECCIÓN DE FILTROS #####
    
    // 1. Seleccionamos los filtros
    const filtroCategoria = document.getElementById('filter-categoria');
    const filtroPrecio = document.getElementById('filter-precio');
    const filtroOferta = document.getElementById('filter-oferta');

    // 2. Creamos una función para "escuchar" los cambios
    function handleFilterChange() {
        const filtrosSeleccionados = {
            categoria: filtroCategoria.value,
            precio: filtroPrecio.value,
            oferta: filtroOferta.checked // .checked nos da true o false
        };
        
        console.log("FILTROS CAMBIARON:", filtrosSeleccionados);
        
        // ¡PRÓXIMO PASO!
        // Aquí es donde llamaríamos de nuevo a la API o
        // filtraríamos los productos que ya tenemos.
        // Ej: cargarProductos(filtrosSeleccionados);
    }

    // 3. Agregamos los 'listeners'
    // (Nos aseguramos de que existan antes de agregar el listener,
    //  así este script no dará error en otras páginas como index.html)
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', handleFilterChange);
    }
    if (filtroPrecio) {
        filtroPrecio.addEventListener('change', handleFilterChange);
    }
    if (filtroOferta) {
        filtroOferta.addEventListener('change', handleFilterChange);
    }
    
    // ##### FIN DE LA SECCIÓN DE FILTROS #####
});


/**
 * 2. Carga los productos (simulando una llamada a la API)
 * * Usamos async/await para simular cómo funcionará 'fetch'
 * cuando conectemos el backend real.
 */
async function cargarProductos() {
    
    // Verificamos que el contenedor de productos exista en esta página
    const productListElement = document.getElementById('product-list');
    if (!productListElement) {
        // Si no existe (ej. estamos en index.html), no hacemos nada.
        return;
    }

    try {
        // --- SIMULACIÓN DE DATOS DEL BACKEND ---
        // Cuando tu backend esté listo, reemplazarás todo este bloque
        // por algo como:
        // const respuesta = await fetch('http://tu-api.com/api/productos');
        // const productos = await respuesta.json();

        // Por ahora, usamos datos "quemados" (hardcodeados)
        const productosSimulados = [
            {
                id: 1,
                nombre: "Laptop Gamer Avanzada",
                descripcion: "Core i5, 32GB RAM, M.2 1TB, RTX 4060",
                precio: 48500.00,
                imagen: "http://localhost:3000/images/laptop-gamer.png" // Asegúrate de tener esta imagen de prueba
            },
            {
                id: 2,
                nombre: "Estación de Trabajo (Desktop)",
                descripcion: "Threadripper, 32GB RAM, SSD 2TB, Quadro RTX A4000",
                precio: 89900.00,
                imagen: "http://localhost:3000/images/desktop-workstation.png"
            },
            {
                id: 3,
                nombre: "Monitor Curvo Ultrawide 49\"",
                descripcion: "Panel OLED, 240Hz, 1ms respuesta",
                precio: 21200.00,
                imagen: "http://localhost:3000/images/monitor-ultrawide.png"
            },
            {
                id: 4,
                nombre: "Teclado Mecánico RGB",
                descripcion: "Switches ópticos, layout 60%, switches Cherry MX Red",
                precio: 3100.00,
                imagen: "http://localhost:3000/images/teclado-mecanico.png"
            }
        ];
        // --- FIN DE LA SIMULACIÓN ---
        
        // 3. Llama a la función que "dibuja" los productos en el HTML
        mostrarProductos(productosSimulados);

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}


//funcion muestra productos estaticos en el index
function mostrarProductos(productos) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        // Nota: Agregamos data-attributes al botón para poder leerlos fácil al hacer click
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <p class="product-price">$${producto.precio.toFixed(2)}</p>
                
                <button class="add-to-cart-btn" 
                    data-id="${producto.id}"
                    data-nombre="${producto.nombre}"
                    data-precio="${producto.precio}"
                    data-imagen="${producto.imagen}">
                    Agregar al carrito
                </button>
            </div>
        `;

        productListElement.appendChild(card);
    });

    // --- ¡NUEVA LÓGICA PARA AGREGAR AL CARRITO! ---
    const botonesAgregar = document.querySelectorAll('.add-to-cart-btn');
    
    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            
            // 1. Validar si está logueado (Requisito del documento)
            const token = localStorage.getItem('userToken');
            if (!token) {
                Swal.fire({
                    title: 'Inicia Sesión',
                    text: 'Necesitas una cuenta para comprar.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ir al Login',
                    cancelButtonText: 'Cancelar',
                    background: '#1a202c',
                    color: '#e2e8f0'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'login.html';
                    }
                });
                return; // Detiene la función
            }

            // 2. Obtener datos del producto desde el botón
            const productoNuevo = {
                id: e.target.dataset.id,
                nombre: e.target.dataset.nombre,
                precio: parseFloat(e.target.dataset.precio),
                imagen: e.target.dataset.imagen,
                cantidad: 1
            };

            // 3. Leer el carrito actual de la memoria
            let carrito = JSON.parse(localStorage.getItem('techUpCarrito')) || [];

            // 4. Revisar si ya existe para sumar cantidad
            const existe = carrito.find(item => item.id === productoNuevo.id);
            
            if (existe) {
                existe.cantidad++;
            } else {
                carrito.push(productoNuevo);
            }

            // 5. Guardar de nuevo en memoria
            localStorage.setItem('techUpCarrito', JSON.stringify(carrito));


            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#1a202c',
                color: '#e2e8f0',
                iconColor: '#00e5ff'
            });
            Toast.fire({
                icon: 'success',
                title: 'Agregado al carrito'
            });
        });
    });
}