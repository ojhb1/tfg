const { Router } = require('express');
const { check } = require('express-validator');
const {crearAnimal,obtenerHabitats,getSonidoAnimal } = require('../controllers/animales');
const router = Router();


router.post('/',[

],crearAnimal);

router.get('/sonido/:id', getSonidoAnimal);

router.get('/:idAnimal',[

],obtenerHabitats);




module.exports = router;