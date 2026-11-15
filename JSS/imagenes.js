// Si falta la foto de un producto, muestra un marcador en vez de la imagen rota,
// para que las tarjetas mantengan el mismo tamaño y el diseño no se desarme.
function marcarSinFoto(img) {
    if (img.dataset.sinFoto) return;
    img.dataset.sinFoto = 'true';
    const aviso = document.createElement('div');
    aviso.className = 'sin-foto';
    aviso.setAttribute('role', 'img');
    aviso.setAttribute('aria-label', img.alt);
    aviso.textContent = 'Foto próximamente';
    img.replaceWith(aviso);
}

document.querySelectorAll('.producto .card-img-top').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
        marcarSinFoto(img);              // ya falló antes de que corriera este script
    } else {
        img.addEventListener('error', () => marcarSinFoto(img));
    }
});
