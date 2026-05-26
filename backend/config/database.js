const sqlServer = require('mssql')

//los datos de conexion
const dbConfig = {
    user : 'adminTienda',
    password: '1234*poli*',
    server: 'localhost',
    database: 'politienda',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

const conexion = async ()=> {

    try {
        //que es lo que tiene que intentar ejecutar
        const pool = await sqlServer.connect(dbConfig)
        return pool
    } catch (error) {
        console.error('error en la conexion: ',error)
    }
    
}

module.exports = conexion