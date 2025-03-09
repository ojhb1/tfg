const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerEtiquetasAnimal } = require('../controllers/etiquetas');
const router = Router();


router.get('/:id',[
  
],obtenerEtiquetasAnimal);



module.exports = router;