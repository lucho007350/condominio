const { Resident, ResidentSchema } = require("./Resident.js");

function setUpModels(sequelize) {
  // Inicialización
  Resident.init(ResidentSchema, Resident.config(sequelize));

  // Relaciones
  Resident.associate(sequelize.models);
}

module.exports = setUpModels;

