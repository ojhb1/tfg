const  sequelize = require('./db'); 

const Animal = require('../models/animal');
const tipoAnimal = require('../models/tipoAnimal');
const Especies = require('../models/especie');
const Etiqueta = require('../models/etiquetas');
const informacionEx = require('../models/informacionEx');
const Habitat = require('../models/habitat');
const initDatabase = async () => {
  try {
    // Autenticar la conexión
    await sequelize.authenticate();
    console.log('Conexión establecida con éxito');

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false }); // Ajusta según tus necesidades

    console.log('Base de datos en línea');

    // Aquí puedes realizar operaciones adicionales para comprobar la funcionalidad de la base de datos
    // Por ejemplo, podrías realizar consultas, inserciones, etc.

    await tipoAnimal.sync();
    await Especies.sync();
    await Animal.sync();
    await Etiqueta.sync();
    await informacionEx.sync();
    await Habitat.sync();
    // Cerrar la conexión al finalizar
   
  } catch (error) {
    console.error('Error al iniciar la BD:', error.message);
    throw new Error('Error al iniciar la BD');
  }
};
module.exports = initDatabase;