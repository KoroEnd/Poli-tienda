
const db = require('../config/database');

class ProductosModel {
    static async obtenerProductos() {
        try {
            const basedatos = await db();
            const resultados = await basedatos.query('SELECT id_producto, nombre, precio, stock, id_categoria FROM productos');
            
            
            return resultados.recordset.map(prod => ({
                id_producto: prod.id_producto,
                nombre: prod.nombre ? prod.nombre.trim() : 'Producto sin nombre',
    
                precio: parseFloat(prod.precio) || 0,
                stock: parseInt(prod.stock, 10) || 0,
                id_categoria: prod.id_categoria || null
            }));
        } catch (error) {
            console.error('[Error Crítico Model - SQL Server]:', error.message);
            
            return [];
        }
    }
}

module.exports = ProductosModel;