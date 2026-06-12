
const ProductosModel = require('../models/productos.model');

const obtenerTodosLosProductos = async (req, res) => {
    try {
        
        const productos = await ProductosModel.obtenerProductos();
        return res.status(200).json(productos);
    } catch (error) {
        console.error('Error en productos.controller.js:', error);
        return res.status(500).json({ 
            error: 'Error interno del servidor al recuperar el catálogo.' 
        });
    }
};

module.exports = {
    obtenerTodosLosProductos
};