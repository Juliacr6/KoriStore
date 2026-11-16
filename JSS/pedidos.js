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
const avisoLector = document.getElementById('aviso');

// Función para actualizar la visualización del carrito en la página
function actualizarCarrito() {
    if (!listaPedido) return;

    listaPedido.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        pedidoVacio.classList.remove('d-none');
        totalSpan.textContent = 'S/ 0.00';
        avisoLector.textContent = 'Tu carrito está vacío.';
        localStorage.removeItem('kori_carrito');
        localStorage.removeItem('kori_total');
        return;
    }

    pedidoVacio.classList.add('d-none');

    carrito.forEach((producto, index) => {
        total += producto.precio * producto.cantidad;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${producto.nombre} (x${producto.cantidad})</span>
            <span>S/ ${(producto.precio * producto.cantidad).toFixed(2)}
                <button type="button" class="btn-quitar" data-index="${index}"
                        aria-label="Quitar ${producto.nombre}">Quitar</button>
            </span>
        `;
        listaPedido.appendChild(li);
    });

    totalSpan.textContent = `S/ ${total.toFixed(2)}`;
    avisoLector.textContent = `Tienes ${carrito.length} productos en tu carrito. Total: S/ ${total.toFixed(2)}`;

    // Guardar en el almacenamiento local del navegador para usarlo en el formulario
    localStorage.setItem('kori_carrito', JSON.stringify(carrito));
    localStorage.setItem('kori_total', total.toFixed(2));

    // Activar botones de quitar de cada ítem
    document.querySelectorAll('.btn-quitar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            carrito.splice(index, 1);
            actualizarCarrito();
        });
    });
}

// Evento para agregar productos desde el catálogo
botonesAnadir.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const article = e.target.closest('.producto');
        let nombre = article.getAttribute('data-nombre');
        const precio = parseFloat(article.getAttribute('data-precio'));

        // Poleras y polos: hay que elegir talla (el resto de productos no tiene selector)
        const grupoTalla = article.querySelector('.tallas');
        if (grupoTalla) {
            const elegida = grupoTalla.querySelector('input[type="radio"]:checked');
            const error = grupoTalla.querySelector('.error-talla');
            if (!elegida) {
                error.textContent = 'Elige una talla antes de añadir.';
                grupoTalla.querySelector('input[type="radio"]').focus();
                return;
            }
            error.textContent = '';
            nombre += ` - Talla ${elegida.value}`;
        }

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

// Cargar el carrito al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});

// Al elegir una talla, se borra el aviso de error
document.querySelectorAll('.tallas input').forEach(radio => {
    radio.addEventListener('change', () => {
        radio.closest('.tallas').querySelector('.error-talla').textContent = '';
    });
});
