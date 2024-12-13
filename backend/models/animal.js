const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  
const Especies = require('./especie');
const Animales = sequelize.define('Animales', {
  // Definir el campo `id` como clave primaria y auto-incremental
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,  
  },
  
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  especieID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
        model: 'especies', 
        key: 'id' 
    }
    }

}, {
  tableName: 'Animales',  // Nombre de la tabla en la base de datos
  timestamps: false,         
});

Animales.belongsTo(Especies, { foreignKey: 'especieID', as: 'Especie' });

module.exports = sequelize.model('Animales', Animales);