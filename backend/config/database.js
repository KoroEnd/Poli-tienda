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

const conexion = async () => {
    try {
        const pool = await sqlServer.connect(dbConfig);
        return pool;
    } catch (error) {
        console.error('Error en la conexión a la base de datos:', error);
        throw error;
    }
};

module.exports = conexion;