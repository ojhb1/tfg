const { Router } = require('express');
const { check } = require('express-validator');
const {crearAnimal } = require('../controllers/animales');
const router = Router();


router.post('/',[

],crearAnimal);



module.exports = router;