const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerTipoAnimal } = require('../controllers/tiposAnimales');
const router = Router();


router.get('/:id',[
    check('id', 'El identificador no es válido').isNumeric(),
],obtenerTipoAnimal);



module.exports = router;