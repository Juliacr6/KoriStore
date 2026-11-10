// ==========================================
// LÓGICA DEL CARRITO DE COMPRAS - KORI STORE
// ==========================================

// Recuperar carrito guardado o iniciar uno vacío
let carrito = JSON.parse(localStorage.getItem('kori_carrito')) || [];

// Elementos del DOM
const botonesAnadir = document.querySelectorAll('.btn-anadir');
const listaPedido = document.getElementById('lista-pedido');
const totalSpan = document.getElementById('total');
const pedidoVacio = document.getElementById('pedido-vacio');
const btnVaciar = document.getElementById('btn-vaciar');
const avisoLector = document.getElementById('aviso');

// Función para actualizar la visualización del carrito en la página
function actualizarCarrito() {
    if (!listaPedido) return;

    listaPedido.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        pedidoVacio.style.display = 'block';
        totalSpan.textContent = 'S/ 0.00';
        avisoLector.textContent = 'Tu carrito está vacío.';
        localStorage.removeItem('kori_carrito');
        return;
    }

    pedidoVacio.style.display = 'none';

    carrito.forEach((producto, index) => {
        total += producto.precio * producto.cantidad;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${producto.nombre} (x${producto.cantidad})</span>
            <span>S/ ${(producto.precio * producto.cantidad).toFixed(2)} 
                <button type="button" class="btn-eliminar" data-index="${index}" style="margin-left: 10px; background: #d90429; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer;">X</button>
            </span>
        `;
        listaPedido.appendChild(li);
    });

    totalSpan.textContent = `S/ ${total.toFixed(2)}`;
    avisoLector.textContent = `Tienes ${carrito.length} productos en tu carrito. Total: S/ ${total.toFixed(2)}`;

    // Guardar en el almacenamiento local del navegador para usarlo en el formulario
    localStorage.setItem('kori_carrito', JSON.stringify(carrito));
    localStorage.setItem('kori_total', total.toFixed(2));

    // Activar botones de eliminar de cada ítem
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            carrito.splice(index, 1);
            actualizarCarrito();
        });
    });
}

// Evento para agregar productos desde el catálogo
botonesAnadir.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const article = e.target.closest('.producto');
        const nombre = article.getAttribute('data-nombre');
        const precio = parseFloat(article.getAttribute('data-precio'));

        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }

        actualizarCarrito();
        
        // Notificación accesible
        if (avisoLector) {
            avisoLector.textContent = `Se añadió ${nombre} al carrito.`;
        }
    });
});

// Botón para vaciar todo el pedido
if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
        carrito = [];
        actualizarCarrito();
    });
}

// Cargar el carrito al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});