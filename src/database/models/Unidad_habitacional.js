const { Model, DataTypes } = require('sequelize');

const UnidadHabitacionalTable = "unidades_habitacionales";

const UnidadHabitacionalSchema = {
  idUnidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipoUnidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  estado: {
  type: DataTypes.ENUM('Disponible', 'Ocupado', 'Desocupado', 'Mantenimiento'),
  allowNull: false,
  defaultValue: 'Disponible'
 },

  area: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  valorCuota: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
};

class UnidadHabitacional extends Model {
  static associate(models) {
    // relaciones futuras
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: UnidadHabitacionalTable,
      modelName: 'UnidadHabitacional',
      timestamps: false
    };
  }
}

module.exports = { UnidadHabitacionalTable, UnidadHabitacionalSchema, UnidadHabitacional };
