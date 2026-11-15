// Confirmación de "Vaciar pedido" con el modal de Bootstrap.
// Usa el arreglo y las funciones de pedidos.js (se carga antes).
document.getElementById('confirmarVaciar').addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
    document.getElementById('aviso').textContent = 'Se vació el pedido. Total: S/ 0.00.';
});
