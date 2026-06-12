const express = require('express');
const router = express.Router();


const { obtenerTodosLosProductos } = require('../controllers/productos.controller');


router.get('/productos', obtenerTodosLosProductos);


module.exports = router;