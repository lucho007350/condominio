const { Model, DataTypes } = require('sequelize');

const ComunicacionTable = "comunicaciones";

const ComunicacionSchema = {
  idComunicado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('Aviso', 'Evento', 'Reglamento', 'Emergencia', 'Otro'),
    allowNull: false
  }
};

class Comunicacion extends Model {
  static associate(models) {
    // Relaciones futuras
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ComunicacionTable,
      modelName: 'Comunicacion',
      timestamps: false
    };
  }
}

module.exports = { ComunicacionTable, ComunicacionSchema, Comunicacion };