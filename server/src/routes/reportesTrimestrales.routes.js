const express = require('express');
const router = express.Router();

const reportesController =
  require('../controllers/reportesTrimestrales.controller');

const { authenticateToken } =
  require('../middleware/auth.middleware');

const { checkPermission } =
  require('../middleware/permission.middleware');

// 3. Crear reporte trimestral
router.post(
  '/seguimiento-acciones/reportes-trimestrales',
  authenticateToken,
  checkPermission('seguimiento-acciones:reportes-trimestrales:create'),
  reportesController.createReporteTrimestral
);

// 4. Listar reportes trimestrales
router.get(
  '/seguimiento-acciones/reportes-trimestrales',
  authenticateToken,
  checkPermission('seguimiento-acciones:reportes-trimestrales:list'),
  reportesController.listReportesTrimestrales
);

// 5. Consultar reporte por ID
router.get(
  '/seguimiento-acciones/reportes-trimestrales/:id',
  authenticateToken,
  checkPermission('seguimiento-acciones:reportes-trimestrales:read'),
  reportesController.getReporteTrimestralById
);

// 6. Actualizar reporte por ID
router.put(
  '/seguimiento-acciones/reportes-trimestrales/:id',
  authenticateToken,
  checkPermission('seguimiento-acciones:reportes-trimestrales:update'),
  reportesController.updateReporteTrimestral
);

// 7. Eliminar reporte por ID
router.delete(
  '/seguimiento-acciones/reportes-trimestrales/:id',
  authenticateToken,
  checkPermission('seguimiento-acciones:reportes-trimestrales:delete'),
  reportesController.deleteReporteTrimestral
);

module.exports = router;