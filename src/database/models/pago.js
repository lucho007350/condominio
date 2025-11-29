const { Model, DataTypes } = require('sequelize');

const PagoTable = "pagos";

const PagoSchema = {
  idPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estadoPago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idFactura: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "idFactura",
    references: {
      model: "facturas",
      key: "idFactura"
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  }
};

class Pago extends Model {
  static associate(models) {
    // Relación con Factura (muchos pagos -> una factura)
    this.belongsTo(models.Factura, {
      as: "factura",
      foreignKey: "idFactura"
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PagoTable,
      modelName: 'Pago',
      timestamps: false
    };
  }
}

module.exports = { PagoTable, PagoSchema, Pago };
