const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerTipoAnimal } = require('../controllers/tiposAnimales');
const router = Router();


router.get('/:id',[
  
],obtenerTipoAnimal);



module.exports = router;