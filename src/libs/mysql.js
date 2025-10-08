const mysql = require ("mysql2/promise");

let connection;

const getConnection = async () => {
    if(!connection){
        connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "condominio"
        });
        console.log("Conectado a la base de datos Exitosamente")
    }

    return connection;
}

module.exports = getConnection; // exportamos la función getConnection para que pueda ser utilizada en otros archivos