const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  
const Animal = require('../models/animal');
const InformacionEx = sequelize.define('InformacionEx', {
  // Definir el campo `id` como clave primaria y auto-incremental
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,  // No puede ser nulo
  },
  // Definir el campo `especie` como un campo de tipo STRING
  informacionSuenyo: {
    type: DataTypes.TEXT,
    allowNull: true,  // No puede ser nulo
  },
  informacionVelocidadMax: {
    type: DataTypes.TEXT,
    allowNull: true,  // No puede ser nulo
  },
  informacionEsperanzaVida:{
    type: DataTypes.TEXT,
    allowNull: true,  // No puede ser nulo
  },
  informacionPoblacion:{
    type: DataTypes.TEXT,
    allowNull: true,  // No puede ser nulo
  },
  informacionAltura:{
    type: DataTypes.TEXT,
    allowNull: true,  // No puede ser nulo
  },
  informacionPeso:{
    type: DataTypes.TEXT,
    allowNull: true,  // No puede ser nulo
  },
  AnimalID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
        model: 'Animales', 
        key: 'id' 
    }
  }
}, {
  tableName: 'InformacionEx',  // Nombre de la tabla en la base de datos
  timestamps: false,         
});

Animal.hasOne(InformacionEx, { foreignKey: 'AnimalID' });
InformacionEx.belongsTo(Animal, { foreignKey: 'AnimalID' });

module.exports = sequelize.model('InformacionEx', InformacionEx);