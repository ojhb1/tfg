const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  
const Animal = require('./animal');  

const Habitat = sequelize.define('Habitat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,  
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  imagenHabitar: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  modelo3D:{
    type: DataTypes.STRING,
    allowNull: true,  
  },
  información:{
    type: DataTypes.TEXT,
    allowNull: true,  
  }
}, {
  tableName: 'Habitat',  // Nombre de la tabla en la base de datos
  timestamps: false         
});

// Tabla intermedia para la relación muchos a muchos entre Animal y Habitat
const AnimalHabitat = sequelize.define('AnimalHabitat', {}, { timestamps: false });

// Relación muchos a muchos
Animal.belongsToMany(Habitat, { through: AnimalHabitat });
Habitat.belongsToMany(Animal, { through: AnimalHabitat });

module.exports = Habitat;
