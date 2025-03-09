const { response } = require('express');
const { Sequelize } = require('sequelize');
const TipoAnimales = require('../models/tipoAnimal');
const Animales = require('../models/animal');
const Especies = require('../models/especie');
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

module.exports = {crearAnimal}