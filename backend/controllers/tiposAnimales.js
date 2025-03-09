const { response } = require('express');
const { Sequelize } = require('sequelize');
const TipoAnimales = require('../models/tipoAnimal');
const Animales = require('../models/animal');
const Especies = require('../models/especie');
const obtenerTipoAnimal = async(req, res = response) => {
    const tipo = req.params.id;
    console.log(tipo);
    try {
        const Tipoanimales = await TipoAnimales.findOne({
            attributes: ['id'], 
            where: {
                especie: tipo
            }
        });
        const animales = await Animales.findAll({
            where:{
                tipoAnimalId:Tipoanimales.id
            }
        })
  
        if (animales.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontraron animales del tipo: ${tipo}`
            });
        }
        
        res.json({
            ok: true,
            animales
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los animales, contacte con el administrador'
        });
    }

}

module.exports = {obtenerTipoAnimal}