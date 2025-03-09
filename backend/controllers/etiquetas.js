const { response } = require('express');
const { Sequelize } = require('sequelize');
const TipoAnimales = require('../models/tipoAnimal');
const Animales = require('../models/animal');
const Especies = require('../models/especie');
const Etiqueta = require('../models/etiquetas');
const InformacionEx = require('../models/informacionEx');
const obtenerEtiquetasAnimal= async(req, res = response) => {
    const animalEtiquetas = req.params.id;
 
    try {
        const animal = await Animales.findAll({
            where: {
                id: animalEtiquetas  // Filtramos por el ID del animal
            },
            include: [
                {
                    model: Etiqueta,  // Incluir las etiquetas relacionadas
                    attributes: ['id', 'nombre', 'informacion'],  // Los atributos de etiquetas que deseamos
                    through: { attributes: [] }  // No necesitamos los atributos de la tabla intermedia
                }
            ]
        });
        const informacion = await InformacionEx.findOne({where:{
            AnimalID: animalEtiquetas
        }});

        res.json({
            ok: true,
            animal,
            informacion
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener etiquetas del animal, contacte con el administrador'
        });
    }

}

module.exports = {obtenerEtiquetasAnimal}