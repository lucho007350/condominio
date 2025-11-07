const { Resident, ResidentSchema } = require("./Resident.js");

function setUpModels(sequelize) {
  // Inicialización
  Resident.init(ResidentSchema, Resident.config(sequelize));

  // Relaciones
  Resident.associate(sequelize.models);
}

module.exports = setUpModels;

const { Comunicacion, ComunicacionSchema } = require("./Comunicacion.js");

function setUpModels(sequelize) {
  // Inicialización del modelo
  Comunicacion.init(ComunicacionSchema, Comunicacion.config(sequelize));

  // Relaciones (si las hubiera en el futuro)
  Comunicacion.associate(sequelize.models);
}

module.exports = setUpModels;


