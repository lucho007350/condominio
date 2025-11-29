const mysql = require("mysql2/promise");

let connectionPromise;

const getConnection = async () => {
  if (!connectionPromise) {
    connectionPromise = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "condominio",
    }).then((conn) => {
      console.log("Conectado a la base de datos Exitosamente");
      return conn;
    });
  }

  return connectionPromise;
};

module.exports = getConnection; // exportamos la función getConnection para que pueda ser utilizada en otros archivos