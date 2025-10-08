const { Sequelize } = require("sequelize");
const setUpModels = require("../database/models/index.js");

const USER = encodeURIComponent("root");
const PASS = encodeURIComponent("");
const DIALECT = 'mysql';

const URI = `${DIALECT}://${USER}:${PASS}@localhost:3306/condominio`;

const sequelize = new Sequelize(URI, {
    dialect: DIALECT,
    logging: false,
});

setUpModels(sequelize);

module.exports = sequelize;