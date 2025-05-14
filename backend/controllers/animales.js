const { response } = require('express');
const { Sequelize } = require('sequelize');
const TipoAnimales = require('../models/tipoAnimal');
const Animales = require('../models/animal');
const Especies = require('../models/especie');
const Habitat = require('../models/habitat');
const crearAnimal= async(req, res = response) => {
    const animal = req.body;
 
    try {
        
        const newAnimal = await Animales.create({
            nombre: animal.nombre, 
            pesoMedio:animal.peso,
            alturaMedia:animal.altura,
            especieID: animal.especie,  
            tipoAnimalID: animal.tipoAnimal
          });
        res.json({
            ok: true,
            newAnimal
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear animal, contacte con el administrador'
        });
    }

}

const obtenerHabitats = async (req, res = response) => {
    const id = req.params.idAnimal; // ID del animal obtenido de los parámetros

    try {
        // Buscar el animal e incluir los habitats relacionados
        const animal = await Animales.findByPk(id, {
            include: {
                model: Habitat,
                through: { attributes: [] } 
            }
        });

        if (!animal) {
            return res.status(404).json({
                ok: false,
                msg: 'Animal no encontrado'
            });
        }
        console.log(animal);
        res.json({
            ok: true,
            habitats: animal.Habitats 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los hábitats, contacte con el administrador'
        });
    }
};
const getSonidoAnimal = async (req, res = response) => {
    const idAnimal = req.params.id;
  
    try {
      const animal = await Animales.findByPk(idAnimal);
  
      if (!animal || !animal.sonidosAnimal) {
        return res.status(404).json({
          ok: false,
          msg: 'Sonido no encontrado para este animal'
        });
      }
  
      // Establece el tipo de contenido (ajusta según el tipo real)
      res.setHeader('Content-Type', 'audio/mpeg'); // o audio/wav
      res.send(animal.sonidosAnimal); // Envía directamente el BLOBS
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al obtener el sonido'
      });
    }
  };
module.exports = {crearAnimal,obtenerHabitats, getSonidoAnimal}