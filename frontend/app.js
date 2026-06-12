
const API_URL = 'http://localhost:4000/api/productos'; 

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosBaseDatos();
});

async function cargarProductosBaseDatos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    
    contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Cargando catálogo...</p>';

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error(`Error en API: ${respuesta.status}`);
        
        const productos = await respuesta.json();
        contenedor.innerHTML = ''; 

        if (productos.length === 0) {
            contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos disponibles.</p>';
            return;
        }

        
        productos.forEach(producto => {
            const id = producto.id_producto;
            const nombre = producto.nombre;
            const precio = producto.precio;
            const stock = producto.stock;

            
            const precioCOP = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(precio);

           
            const divPublicacion = document.createElement('div');
            divPublicacion.className = 'publicacion';
            
            divPublicacion.innerHTML = `
                <img class="img-pub" src="assets/publicacion.png" alt="${nombre}">
                
                <div class="info-producto" style="padding: 10px; text-align: center;">
                    <h3 style="margin: 5px 0; font-size: 1.1rem;">${nombre}</h3>
                    <p style="margin: 5px 0; font-weight: bold; color: #2563eb;">${precioCOP}</p>
                    <small style="color: #777;">Disponibles: ${stock}</small>
                </div>

                <div class="bottones">
                    <button onclick="verDetalle(${id})">detalle</button>
                    <button onclick="agregarAlCarrito(${id})">agregar a 🛒</button>
                </div>
            `;
            
            contenedor.appendChild(divPublicacion);
        });

    } catch (error) {
        console.error('Error al cargar la UI:', error);
        contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Error al conectar con la base de datos.</p>';
    }
}


function verDetalle(id) {
    console.log(`Abriendo detalles del producto: ${id}`);
}

function agregarAlCarrito(id) {
    console.log(`Producto ${id} añadido al carrito.`);
    alert(`Producto añadido al carrito de compras`);
}