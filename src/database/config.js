const USER = encodeURIComponent('root');
const PASS = encodeURIComponent("");
const DIALECT = "mysql";

const URI = `${DIALECT}://${USER}:${PASS}@localhost:3306/condominio`;

module.exports = {
    development: {
        url: URI,
        dialect: DIALECT
    },
    production:{
        url: URI,
        dialect: DIALECT
    },
};