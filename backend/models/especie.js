const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  
const tipoAnimal = require('./tipoAnimal');
const Especies = sequelize.define('Especies', {
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
  tipoAnimalID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
        model: 'TipoAnimales', 
        key: 'id' 
    }
    }

}, {
  tableName: 'Especies',  // Nombre de la tabla en la base de datos
  timestamps: false,         
});

Especies.belongsTo(tipoAnimal, { foreignKey: 'tipoAnimalID', as: 'tipoAnimal' });


module.exports = sequelize.model('Especies', Especies);