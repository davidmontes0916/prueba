const express = require('express');
const router = express.Router();
const riesgoController = require('../controllers/riesgo.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');
const upload = require('../utils/fileUpload');

// CRUD de Riesgos alineado al submódulo
router.post('/matriz-seguimiento/riesgos', authenticateToken, checkPermission('matriz-seguimiento:riesgos:create'), riesgoController.createRiesgo);
router.get('/matriz-seguimiento/riesgos', authenticateToken, checkPermission('matriz-seguimiento:riesgos:list'), riesgoController.listRiesgos);
router.get('/matriz-seguimiento/riesgos/:id', authenticateToken, checkPermission('matriz-seguimiento:riesgos:read'), riesgoController.getRiesgoById);
router.put('/matriz-seguimiento/riesgos/:id', authenticateToken, checkPermission('matriz-seguimiento:riesgos:update'), riesgoController.updateRiesgo);
router.delete('/matriz-seguimiento/riesgos/:id', authenticateToken, checkPermission('matriz-seguimiento:riesgos:delete'), riesgoController.deleteRiesgo);

// Endpoint del mapa de riesgos para subir archivos usando Multer
router.post('/mapa-riesgos/upload', authenticateToken, upload.single('archivo'), riesgoController.uploadMapaRiesgoArchivo);

module.exports = router;
