const { Router } = require('express');
const { check } = require('express-validator');
const {crearAnimal,obtenerHabitats } = require('../controllers/animales');
const router = Router();


router.post('/',[

],crearAnimal);


router.get('/:idAnimal',[

],obtenerHabitats);




module.exports = router;