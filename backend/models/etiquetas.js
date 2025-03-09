const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');  
const Animal = require('./animal');

const Etiqueta = sequelize.define('Etiqueta', {
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
  informacion:{
    type: DataTypes.TEXT,
    allowNull: false,  
  }
}, {
  tableName: 'Etiquetas',  // Nombre de la tabla en la base de datos
  timestamps: false         
});

// Tabla intermedia para la relación muchos a muchos
const AnimalEtiqueta = sequelize.define('AnimalEtiqueta', {}, { timestamps: false });

// Relación muchos a muchos
Animal.belongsToMany(Etiqueta, { through: AnimalEtiqueta });
Etiqueta.belongsToMany(Animal, { through: AnimalEtiqueta });

(async () => {
    await sequelize.sync({ alter: true });
  
    const etiquetas = [
      'Carnívoro', 'Herbívoro', 'Nómada', 'En Manada', 'Solitario',
      'Familiar', 'Carroñero', 'Nocturno', 'Diurno', 'Explorador',
      'Omnívoro', 'Acuático', 'Terrestre', 'Volador', 'Veneno','Tóxico',
      'Depredador', 'Preservador', 'Migratorio', 'Hibernador',
      'Territorial', 'Ovíparo', 'Vivíparo', 'Anfibio', 'Subterráneo',
      'Arborícola', 'Endotérmico', 'Ectotérmico', 'Polígamo', 'Monógamo'
    ];
  
    console.log('Etiquetas insertadas correctamente con SQL');
  })();
module.exports = Etiqueta;