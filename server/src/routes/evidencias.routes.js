const express = require('express');
const router = express.Router();

const evidenciasController =
  require('../controllers/evidencias.controller');

const { authenticateToken } =
  require('../middlewares/auth.middleware');

const { authorizePermission } =
  require('../middlewares/permission.middleware');

// 1. Subir evidencia
router.post(
  '/upload',
  authenticateToken,
  authorizePermission('seguimiento-acciones:evidencias:upload'),
  evidenciasController.uploadEvidencia
);

// 2. Listar evidencias
router.get(
  '/',
  authenticateToken,
  authorizePermission('seguimiento-acciones:evidencias:list'),
  evidenciasController.listEvidencias
);

// 3. Consultar evidencia por ID
router.get(
  '/:id',
  authenticateToken,
  authorizePermission('seguimiento-acciones:evidencias:read'),
  evidenciasController.getEvidenciaById
);

// 4. Actualizar únicamente el estatus de evidencia
router.patch(
  '/:id/update-status',
  authenticateToken,
  authorizePermission('gestion-evidencias:evidencias:update-status'),
  evidenciasController.updateStatusEvidencia
);

// 5. Eliminar evidencia por ID
router.delete(
  '/:id',
  authenticateToken,
  authorizePermission('seguimiento-acciones:evidencias:delete'),
  evidenciasController.deleteEvidencia
);

module.exports = router;