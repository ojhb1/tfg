const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  

const TipoAnimales = sequelize.define('TipoAnimales', {
  // Definir el campo `id` como clave primaria y auto-incremental
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,  // No puede ser nulo
  },
  // Definir el campo `especie` como un campo de tipo STRING
  especie: {
    type: DataTypes.STRING,
    allowNull: false,  // No puede ser nulo
  }
}, {
  tableName: 'TipoAnimales',  // Nombre de la tabla en la base de datos
  timestamps: false,         
});

module.exports = sequelize.model('TipoAnimales', TipoAnimales);