const express = require('express');
const cors = require('cors');
const path = require('path');

const rutasProyecto = require('./routes/router'); 

const app = express();
const PORT = 4000; 

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api', rutasProyecto);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'productos.html'));
});

app.listen(PORT, () => {
    console.log(`[Servidor] Corriendo con éxito en el puerto ${PORT}`);
    console.log(`[API] Endpoint de productos listo en: http://localhost:${PORT}/api/productos`);
    console.log(`[Frontend] Abre la aplicación en: http://localhost:${PORT}`);
});