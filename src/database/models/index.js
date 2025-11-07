const { UnidadHabitacional, UnidadHabitacionalSchema } = require("./Unidad_habitacional");

function setUpModels(sequelize) {
  // Inicializacion
  UnidadHabitacional.init(UnidadHabitacionalSchema, UnidadHabitacional.config(sequelize));

  //relaciones
  UnidadHabitacional.associate(sequelize.models);
}

module.exports = setUpModels;