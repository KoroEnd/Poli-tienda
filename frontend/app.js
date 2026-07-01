const API_URL = 'http://localhost:4000/api/productos';
let carrito = [];
try {
    carrito = JSON.parse(localStorage.getItem('poli_carrito')) || [];
} catch (error) {
    carrito = [];
}
const PRODUCTOS_DESEADOS_IDS = [4, 5, 6];

const productosManual = [
    {
        id: 4,
        nombre: 'Audífonos',
        precio: 72000,
        stock: 10,
        imagen: 'assets/images/audifonos.jpeg',
        descripcion: 'Auriculares con sonido claro para música y llamadas.'
    },
    {
        id: 5,
        nombre: 'Gorra',
        precio: 45000,
        stock: 8,
        imagen: 'assets/images/gorra.jpg',
        descripcion: 'Gorra cómoda para el día a día con estilo deportivo.'
    },
    {
        id: 6,
        nombre: 'Organizador',
        precio: 32000,
        stock: 6,
        imagen: 'assets/images/organizador.jpg',
        descripcion: 'Organizador práctico para tu escritorio o mochila.'
    },
    {
        id: 7,
        nombre: 'Teléfono Inteligente',
        precio: 420000,
        stock: 5,
        imagen: 'assets/images/telefono.jpeg',
        descripcion: 'Smartphone con buena batería y cámara para uso diario.'
    },
    {
        id: 8,
        nombre: 'Camiseta de Algodón',
        precio: 35000,
        stock: 15,
        imagen: 'assets/images/camiseta.jpeg',
        descripcion: 'Camiseta cómoda y moderna para todos los días.'
    },
    {
        id: 9,
        nombre: 'Lámpara de Escritorio',
        precio: 58000,
        stock: 7,
        imagen: 'assets/images/lampara.jpeg',
        descripcion: 'Lámpara práctica para tu escritorio o tu habitación.'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosBaseDatos();
    actualizarInterfazCarrito();

    const botonCarrito = document.querySelector('.btn-carrito');
    if (botonCarrito) {
        botonCarrito.addEventListener('click', () => {
            renderizarReciboCompra();
            toggleRecibo();
        });
    }
});

async function cargarProductosBaseDatos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b; font-family: sans-serif;">
            <p style="margin: 0; font-size: 1.1rem; letter-spacing: 0.5px;">Sincronizando catálogo con SQL Server...</p>
        </div>
    `;

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error(`HTTP Error! Status: ${respuesta.status}`);

        const productos = await respuesta.json();
        const manualPorId = new Map(productosManual.map(manual => [manual.id, manual]));
        const manualPorNombre = new Map(productosManual.map(manual => [manual.nombre.toLowerCase(), manual]));
        const productosMap = new Map();

        if (Array.isArray(productos)) {
            productos.forEach(prod => {
                const id = Number(prod.id_producto ?? prod.id);
                const nombre = prod.nombre ? prod.nombre.trim() : 'Producto sin nombre';
                const nombreKey = nombre.toLowerCase();
                const manual = manualPorId.get(id) || manualPorNombre.get(nombreKey);

                if (manual) {
                    if (!productosMap.has(manual.id)) {
                        productosMap.set(manual.id, { ...manual });
                    }
                } else {
                    if (!productosMap.has(id)) {
                        productosMap.set(id, {
                            id,
                            nombre,
                            precio: Number(prod.precio) || 0,
                            stock: Number(prod.stock) || 0,
                            imagen: prod.imagen || getImagenPorId(id),
                            descripcion: prod.descripcion || getDescripcionPorId(id, nombre)
                        });
                    }
                }
            });
        }

        productosManual.forEach(manual => {
            if (!productosMap.has(manual.id)) {
                productosMap.set(manual.id, manual);
            }
        });

        const productosFinal = Array.from(productosMap.values());

        if (!productosFinal.length) {
            contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">No se encontraron artículos en el catálogo.</p>';
            return;
        }

        renderizarProductos(productosFinal, contenedor);
    } catch (error) {
        console.error('[Error de Comunicación Frontend]:', error);
        renderizarProductos(productosManual, contenedor);
    }
}

function getImagenPorId(id) {
    if (id === 4) return 'assets/images/audifonos.jpeg';
    if (id === 5) return 'assets/images/gorra.jpg';
    if (id === 6) return 'assets/images/organizador.jpg';
    if (id === 7) return 'assets/images/telefono.jpeg';
    if (id === 8) return 'assets/images/camiseta.jpeg';
    if (id === 9) return 'assets/images/lampara.jpeg';
    return 'assets/images/publicacion.png';
}

function getDescripcionPorId(id, nombre) {
    const titulo = (nombre || '').toLowerCase();
    if (id === 4 || titulo.includes('audífono') || titulo.includes('audifonos')) {
        return 'Auriculares con sonido claro para música y llamadas.';
    }
    if (id === 5 || titulo.includes('gorra')) {
        return 'Gorra cómoda para el día a día con estilo deportivo.';
    }
    if (id === 6 || titulo.includes('organizador')) {
        return 'Organizador práctico para tu escritorio o mochila.';
    }
    if (id === 7 || titulo.includes('teléfono') || titulo.includes('telefono')) {
        return 'Smartphone con buena batería y cámara para uso diario.';
    }
    if (id === 8 || titulo.includes('camiseta')) {
        return 'Camiseta cómoda y moderna para todos los días.';
    }
    if (id === 9 || titulo.includes('lámpara') || titulo.includes('lampara')) {
        return 'Lámpara práctica para tu escritorio o tu habitación.';
    }
    return 'Producto de alta calidad pensado para tu rutina diaria.';
}

function renderizarProductos(productos, contenedor) {
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const { id, nombre, precio, stock, imagen, descripcion } = producto;
        const precioCOP = formatearMoneda(precio);

        const divPublicacion = document.createElement('div');
        divPublicacion.className = 'publicacion';
        divPublicacion.style.backgroundColor = '#002855';

        const imagenContenedor = document.createElement('div');
        imagenContenedor.style.cssText = 'width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; background: #fff; overflow: hidden; border-top-left-radius: 8px; border-top-right-radius: 8px;';
        const img = document.createElement('img');
        img.src = imagen;
        img.alt = nombre;
        img.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
        img.onerror = function () { this.src = 'assets/images/publicacion.png'; };
        imagenContenedor.appendChild(img);

        const infoContainer = document.createElement('div');
        infoContainer.style.cssText = 'padding: 15px; text-align: center; font-family: sans-serif;';
        infoContainer.innerHTML = `
            <h3 style="margin: 0 0 8px 0; font-size: 1rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${nombre}</h3>
            <p style="margin: 0 0 4px 0; font-size: 1.2rem; font-weight: 700; color: #ffffff;">${precioCOP}</p>
            <small style="color: #cbd5e1; font-size: 0.8rem;">Disponibles: ${stock} u.</small>
        `;

        const botones = document.createElement('div');
        botones.className = 'bottones';

        const botonAgregar = document.createElement('button');
        botonAgregar.className = 'btn-accion';
        botonAgregar.textContent = 'Agregar a 🛒';
        botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(id, nombre, precio, descripcion);
        });

        const botonDetalle = document.createElement('button');
        botonDetalle.className = 'btn-detalle';
        botonDetalle.textContent = 'Detalle';
        botonDetalle.addEventListener('click', () => {
            toggleDetalle(`detalle-${id}`, botonDetalle);
        });

        botones.appendChild(botonAgregar);
        botones.appendChild(botonDetalle);

        const detalleTexto = document.createElement('div');
        detalleTexto.className = 'detalle-texto';
        detalleTexto.id = `detalle-${id}`;
        detalleTexto.style.cssText = 'display: none; padding: 0 15px 15px 15px; text-align: left;';
        detalleTexto.innerHTML = `<p style="margin: 0; color: #e2e8f0; font-size: 0.9rem; line-height: 1.4;">${descripcion || 'Descripción no disponible para este producto.'}</p>`;

        divPublicacion.appendChild(imagenContenedor);
        divPublicacion.appendChild(infoContainer);
        divPublicacion.appendChild(botones);
        divPublicacion.appendChild(detalleTexto);
        contenedor.appendChild(divPublicacion);
    });
}

function renderizarReciboCompra() {
    let contenedorRecibo = document.getElementById('recibo-compra-modal');
    if (!contenedorRecibo) {
        contenedorRecibo = document.createElement('div');
        contenedorRecibo.id = 'recibo-compra-modal';
        contenedorRecibo.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); width: 350px; background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-family: sans-serif; display: none; z-index: 1000; overflow: hidden; border: 1px solid #e2e8f0;';
        document.body.appendChild(contenedorRecibo);
    }

    if (carrito.length === 0) {
        contenedorRecibo.innerHTML = `<div style="padding: 25px; text-align: center; color: #64748b;"><p style="margin: 0;">Tu carrito está vacío</p></div>`;
        return;
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.19; 
    const total = subtotal + iva;

    let itemsHTML = '';
    carrito.forEach(item => {
        itemsHTML += `
            <div style="margin-bottom: 14px; font-size: 0.9rem; color: #334155;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <span style="font-weight: 600; color: #002855;">${item.cantidad}x</span> ${item.nombre}
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${formatearMoneda(item.precio * item.cantidad)}</span>
                        <button style="background: none; border: none; color: #ef4444; cursor: pointer; font-weight: bold;" onclick="eliminarDelCarrito(${item.id})">✕</button>
                    </div>
                </div>
                ${item.descripcion ? `<div style="color: #64748b; font-size: 0.8rem; margin-top: 4px;">${item.descripcion}</div>` : ''}
            </div>
        `;
    });

    contenedorRecibo.innerHTML = `
        <div style="background: #002855; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
            <span>🧾 Recibo de Compra</span>
            <span style="cursor: pointer;" onclick="toggleRecibo()">✕</span>
        </div>
        <div style="padding: 15px; max-height: 200px; overflow-y: auto; border-bottom: 1px dashed #cbd5e1;">
            ${itemsHTML}
        </div>
        <div style="padding: 15px; background: #f8fafc; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #64748b;">
                <span>Subtotal:</span><span>${formatearMoneda(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #64748b;">
                <span>IVA (19%):</span><span>${formatearMoneda(iva)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem; color: #1e293b; margin-top: 5px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                <span>Total:</span><span style="color: #059669;">${formatearMoneda(total)}</span>
            </div>
            <button style="width: 100%; background: #1e40af; color: white; border: none; border-radius: 4px; padding: 12px; margin-top: 15px; font-weight: bold; cursor: pointer;" onclick="procesarPago()">
                Proceder al Pago
            </button>
        </div>
    `;
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarYActualizar();
}

function guardarYActualizar() {
    localStorage.setItem('poli_carrito', JSON.stringify(carrito));
    actualizarInterfazCarrito();
}

function agregarAlCarrito(id, nombre, precio, descripcion) {
    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, descripcion, cantidad: 1 });
    }
    guardarYActualizar();
}

function actualizarInterfazCarrito() {
    const botonCarrito = document.querySelector('.btn-carrito');
    if (!botonCarrito) return;

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    let badge = botonCarrito.querySelector('.carrito-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'carrito-badge';
        botonCarrito.appendChild(badge);
    }

    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function toggleRecibo() {
    const modal = document.getElementById('recibo-compra-modal');
    if (!modal) return;
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function procesarPago() {
    alert('¡Compra simulada con éxito! Redireccionando a la pasarela de pagos...');
    carrito = [];
    localStorage.removeItem('poli_carrito');
    actualizarInterfazCarrito();
    toggleRecibo();
}

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}

function toggleDetalle(detalleId, boton) {
    const contenedor = document.getElementById(detalleId);
    if (!contenedor) return;

    const oculto = contenedor.style.display === 'none' || !contenedor.style.display;
    contenedor.style.display = oculto ? 'block' : 'none';
    if (boton) {
        boton.textContent = oculto ? 'Ocultar' : 'Detalle';
    }
}


function verDetalle(id, encodedName, precio, rutaImagen) {
    const nombre = decodeURIComponent(encodedName || '');
    // crear modal
    let modal = document.getElementById('detalle-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'detalle-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.5); z-index: 2000;';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background:white; border-radius:8px; width: 90%; max-width: 420px; overflow: hidden;">
            <div style="padding: 16px; text-align: right;"><button style="border:none; background:none; font-size:18px; cursor:pointer;" onclick="document.getElementById('detalle-modal').style.display='none'">✕</button></div>
            <div style="padding: 0 24px 24px; text-align: center;">
                <img src="${rutaImagen}" alt="${nombre}" style="max-width: 200px; height: auto; display:block; margin: 0 auto 12px;">
                <h3 style="margin: 0 0 8px 0;">${nombre}</h3>
                <p style="margin:0 0 12px 0; font-weight:700;">${formatearMoneda(precio)}</p>
                <div style="display:flex; gap:12px; justify-content:center;">
                    <button style="background:#1e40af; color:white; border:none; padding:10px 18px; border-radius:6px;" onclick="document.getElementById('detalle-modal').style.display='none'">Cerrar</button>
                        <button class="btn-accion" onclick="(function(){ agregarAlCarrito(id, decodeURIComponent(encodedName), precio); document.getElementById('detalle-modal').style.display='none'; })()">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}









