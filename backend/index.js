const express = require('express');
const cors = require('cors');

const rutasProyecto = require('./routes/router'); 

const app = express();
const PORT = 4000; 


app.use(cors());         
app.use(express.json());  


app.use('/api', rutasProyecto); 


app.listen(PORT, () => {
    console.log(`[Servidor] Corriendo con éxito en el puerto ${PORT}`);
    console.log(`[API] Endpoint de productos listo en: http://localhost:${PORT}/api/productos`);
});