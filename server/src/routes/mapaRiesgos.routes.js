const express = require('express');
const router = express.Router();
const mapaRiesgoController = require('../controllers/mapaRiesgo.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

router.post('/mapa-riesgos',
  authenticateToken,
  checkPermission(4, 1),  // recurso Mapa de riesgos (4), acción create (1)
  mapaRiesgoController.createMapaRiesgo
);

router.delete('/mapa-riesgos/:id',
  authenticateToken,
  checkPermission(4, 4),  // recurso Mapa de riesgos (4), acción delete (4)
  mapaRiesgoController.deleteMapaRiesgo
);

module.exports = router;