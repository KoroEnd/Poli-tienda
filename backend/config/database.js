const sqlServer = requier('mssql')

//los datos de conexion
const dbConfig = {
    user : 'adminTienda',
    password: '1234*poli*',
    server: 'localhost\SQLEXPRESS',
    database: 'politienda',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

const conexion = async ()=> {
    const pool = await sqlServer.connect(dbConfig)
    return pool
}

module.exports = conexion