document.addEventListener('DOMContentLoaded', () => {
    
    // *** CONFIGURACIÓN DE ACCESO DE ADMINISTRADOR (SIMULADO) ***
    // NOTA: En producción, el servidor debe establecer esta variable de forma segura.
    const isAdmin = true; // Cambia a 'false' para ver la vista de usuario
    
    const userContent = document.getElementById('user-content');
    const adminPanel = document.getElementById('admin-panel');
    
    // Ejecución inicial: decide qué panel mostrar
    if (isAdmin) {
        if(userContent) userContent.style.display = 'none';
        if(adminPanel) adminPanel.style.display = 'block';
        setupAdminTabs();
        setupAdminCRUD(); // Inicializa la lógica CRUD
    } else {
        if(userContent) userContent.style.display = 'block'; 
        if(adminPanel) adminPanel.style.display = 'none'; 
    }

    // --- Lógica de Pestañas (Tabs) ---
    function setupAdminTabs() {
        const tabs = document.querySelectorAll('.admin-tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('data-tab');

                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.style.display = 'none');

                e.target.classList.add('active');

                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }

    // --- Lógica CRUD con Modal y SweetAlert2 ---
    function setupAdminCRUD() {
        const addModalBtn = document.getElementById('open-add-modal-btn');
        const productFormModal = document.getElementById('product-form-modal');
        const productForm = document.getElementById('product-form');
        const formTitle = document.getElementById('form-title');
        const formMode = document.getElementById('form-mode');
        const tableBody = document.querySelector('#products-table tbody');
        const cancelButton = document.getElementById('cancel-form-btn');

        // FUNCIÓN PARA MOSTRAR/OCULTAR EL MODAL y CARGAR DATOS
        function toggleFormModal(show, mode = 'add', data = {}) {
            if (show) {
                if (mode === 'add') {
                    formTitle.textContent = 'Dar de Alta Nuevo Producto';
                    formMode.value = 'add';
                    productForm.reset();
                    document.getElementById('productId').readOnly = false; // Permitir cambiar ID en Alta
                } 
                else if (mode === 'edit') {
                    formTitle.textContent = 'Modificar Producto ID: ' + data.productId;
                    formMode.value = 'edit';
                    
                    // Cargar campos con datos existentes (usando las claves del JSON)
                    document.getElementById('userId').value = data.userId;
                    document.getElementById('productId').value = data.productId;
                    document.getElementById('productId').readOnly = true; // No cambiar ID en Edición
                    document.getElementById('nombre').value = data.nombre;
                    document.getElementById('precio').value = data.precio;
                    document.getElementById('cantidad').value = data.cantidad;
                    document.getElementById('imagen').value = data.imagen;
                }
                productFormModal.style.display = 'block';
            } else {
                productFormModal.style.display = 'none';
            }
        }

        // ABRIR MODAL (Dar de Alta)
        if(addModalBtn) {
            addModalBtn.addEventListener('click', () => {
                toggleFormModal(true, 'add');
            });
        }

        // CERRAR MODAL (Cancelar)
        if(cancelButton) {
            cancelButton.addEventListener('click', () => {
                toggleFormModal(false);
            });
        }

        // ----------------------------------------------------
        // 1. MANEJO DE ALTA/MODIFICACIÓN (SweetAlert de Guardar)
        // ----------------------------------------------------
        if(productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const mode = formMode.value;
                const productName = document.getElementById('nombre').value;

                // Simulación de envío al backend: Aquí se llamaría a fetch()
                const success = Math.random() > 0.3; // Simulación: 70% de éxito

                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: (mode === 'add' ? '¡Producto Agregado!' : '¡Producto Actualizado!'),
                        text: `El producto "${productName}" ha sido ${mode === 'add' ? 'dado de alta' : 'modificado'} correctamente.`,
                        confirmButtonText: 'Aceptar',
                        customClass: { popup: 'dark-alert-popup' }
                    });
                    toggleFormModal(false);
                    // Lógica para refrescar la tabla...
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Operación',
                        text: 'Hubo un error al intentar guardar el producto. Verifica los datos.',
                        confirmButtonText: 'Cerrar',
                        customClass: { popup: 'dark-alert-popup' }
                    });
                }
            });
        }
        
        // ----------------------------------------------------
        // 2. MANEJO DE EVENTOS DE LA TABLA (Editar y Eliminar)
        // ----------------------------------------------------
        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (!row) return;

                const productId = row.dataset.id;
                
                // Capturar datos de la fila para Edición
                const data = {
                    userId: row.dataset.userid,
                    productId: row.dataset.id,
                    nombre: row.dataset.nombre,
                    precio: row.dataset.precio,
                    cantidad: row.dataset.cantidad,
                    imagen: row.dataset.imagen,
                };
                
                // --- Botón EDITAR (Modificar) ---
                if (e.target.classList.contains('edit-btn')) {
                    // Muestra el modal en modo edición con los datos cargados
                    toggleFormModal(true, 'edit', data);
                } 
                
                // --- Botón ELIMINAR (Baja) ---
                else if (e.target.classList.contains('delete-btn')) {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: `Vas a eliminar el producto ID: ${productId}. ¡Esta acción es irreversible!`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ff4d4d', 
                        cancelButtonColor: '#a0aec0',
                        confirmButtonText: 'Sí, ¡Eliminar!',
                        cancelButtonText: 'Cancelar',
                        customClass: { popup: 'dark-alert-popup' }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Simulación de eliminación exitosa: Aquí iría tu fetch DELETE
                            Swal.fire({
                                title: '¡Eliminado!',
                                text: `El producto ID: ${productId} ha sido borrado correctamente.`,
                                icon: 'success',
                                customClass: { popup: 'dark-alert-popup' }
                            });
                            // Lógica para quitar la fila (row.remove())
                        }
                    });
                }
            });
        }
    }
});