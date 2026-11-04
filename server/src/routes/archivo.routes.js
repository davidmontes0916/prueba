const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivo.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

// Reutilizamos el middleware de multer configurado previamente para validar formatos png, pdf, jpeg
const upload = require('../utils/fileUpload');

// Subir archivo y registrar en BD
router.post('/mapa-riesgos/archivos/upload',
  authenticateToken,
  checkPermission('mapa-riesgos:archivos:upload'),
  upload.single('archivo'), // Campo form-data en Postman
  archivoController.uploadArchivo
);

// Listar todos los archivos
router.get('/mapa-riesgos/archivos',
  authenticateToken,
  checkPermission('mapa-riesgos:archivos:list'),
  archivoController.listArchivos
);

// Consultar por ID
router.get('/mapa-riesgos/archivos/:id',
  authenticateToken,
  checkPermission('mapa-riesgos:archivos:read'),
  archivoController.getArchivoById
);

// Eliminar archivo por ID
router.delete('/mapa-riesgos/archivos/:id',
  authenticateToken,
  checkPermission('mapa-riesgos:archivos:delete'),
  archivoController.deleteArchivo
);

// Ruta para previsualizar cualquier archivo por su nombre físico en disco
router.get('/mapa-riesgos/archivos/preview/:filename',
  authenticateToken, // Protegido para que solo usuarios logueados puedan ver archivos
  archivoController.previewArchivo
);


module.exports = router;
