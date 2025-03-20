const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  
const Especies = require('./especie');
const tipoAnimal = require('./tipoAnimal');
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
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,  
  },
  animaciones: {
    type: DataTypes.JSON,
    allowNull: true,  
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  reproduccion:{
    type: DataTypes.TEXT,
    allowNull:true
  },
  pesoMedio:{
    type: DataTypes.FLOAT,
    allowNull:true
  },
  alturaMedia:{
    type: DataTypes.FLOAT,
    allowNull:true
  },
  dietaYcaza:{
    type: DataTypes.TEXT,
    allowNull:true
  },
  alimentación:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  historia:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  poblacion:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  esperanzaVida:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  velocidadMax:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  horasSuenyo:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sonidosAnimal:{
    type: DataTypes.JSON,
    allowNull: true,
  },
  paisesAnimal:{
    type: DataTypes.JSON,
    allowNull: true,
  },
  especieID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
        model: 'especies', 
        key: 'id' 
    }
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
  tableName: 'Animales',  // Nombre de la tabla en la base de datos
  timestamps: false,         
});

Animales.belongsTo(Especies, { foreignKey: 'especieID', as: 'Especie' });
Animales.belongsTo(tipoAnimal, { foreignKey: 'tipoAnimalID', as: 'tipoAnimal' });
module.exports = sequelize.model('Animales', Animales);