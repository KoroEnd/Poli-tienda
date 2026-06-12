const sqlServer = require('mssql')

//los datos de conexion
const dbConfig = {
    user : 'Admin_Expo_Star',
    password: 'Leinaldo23r',
    server: 'localhost',
    database: 'Expo_Star',
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