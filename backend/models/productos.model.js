const db = require('../config/database')


class ProductosModel{

    static async obtenerProductos(){
        const basedatos = await db()
        const resultados = await basedatos.query('select * from producto')

        return resultados.recordset
    }

}

const prueba = ProductosModel
console.dir(prueba.obtenerProductos())