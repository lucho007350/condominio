const { Model, DataTypes } = require('sequelize');

const FacturaTable = "facturas";

const FacturaSchema = {
  idFactura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estadoFactura: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idUnidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'unidades_habitacionales', // <--- Nombre real de tu tabla UnidadHabitacional
      key: 'idUnidad'       // <--- Campo clave primaria real
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
};

class Factura extends Model {
  static associate(models) {
    // Relación con UnidadHabitacional
    this.belongsTo(models.UnidadHabitacional, {
      foreignKey: 'idUnidad',
      as: 'unidad'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: FacturaTable,
      modelName: 'Factura',
      timestamps: false
    };
  }
}

module.exports = { FacturaTable, FacturaSchema, Factura };
