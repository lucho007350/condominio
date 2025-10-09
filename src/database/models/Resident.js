const { Model, DataTypes } = require('sequelize');

const ResidentTable = "residentes";

const ResidentSchema = {
  idResidente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoResidente: {
    type: DataTypes.ENUM('Propietario', 'Arrendatario',),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false
  }
};

class Resident extends Model {
  static associate(models) {
    // Relaciones futuras
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ResidentTable,
      modelName: 'Resident',
      timestamps: false
    };
  }
}

module.exports = { ResidentTable, ResidentSchema, Resident };
