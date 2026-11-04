const express = require('express');
const router = express.Router();

const accionesControlController =
  require('../controllers/accionesControl.controller');

const { authenticateToken } =
  require('../middleware/auth.middleware');

const { checkPermission } =
  require('../middleware/permission.middleware');

// RUTAS ORIGINALES: MATRIZ DE SEGUIMIENTO

// Crear acción de control
router.post(
  '/matriz-seguimiento/acciones-control',
  authenticateToken,
  checkPermission('matriz-seguimiento:acciones-control:create'),
  accionesControlController.createAccionControl
);

// Listar acciones de control
router.get(
  '/matriz-seguimiento/acciones-control',
  authenticateToken,
  checkPermission('matriz-seguimiento:acciones-control:list'),
  accionesControlController.listAccionesControl
);

// Listar acciones de control por unidad administrativa
router.get(
  '/matriz-seguimiento/acciones-control/unidad/:id_unidad_administrativa',
  authenticateToken,
  checkPermission('matriz-seguimiento:acciones-control:list'),
  accionesControlController.listAccionesControlPorUnidad
);

// Consultar acción por ID
router.get(
  '/matriz-seguimiento/acciones-control/:id',
  authenticateToken,
  checkPermission('matriz-seguimiento:acciones-control:read'),
  accionesControlController.getAccionControlById
);

// Editar acción de control
router.put(
  '/matriz-seguimiento/acciones-control/:id',
  authenticateToken,
  checkPermission('matriz-seguimiento:acciones-control:update'),
  accionesControlController.updateAccionControl
);

// Eliminar acción de control
router.delete(
  '/matriz-seguimiento/acciones-control/:id',
  authenticateToken,
  checkPermission('matriz-seguimiento:acciones-control:delete'),
  accionesControlController.deleteAccionControl
);

// NUEVAS RUTAS: SEGUIMIENTO DE ACCIONES

// 1. Listar acciones de control
router.get(
  '/seguimiento-acciones/acciones-control',
  authenticateToken,
  checkPermission('seguimiento-acciones:acciones-control:list'),
  accionesControlController.listAccionesControl
);

// Listar acciones de control por unidad administrativa
router.get(
  '/seguimiento-acciones/acciones-control/unidad/:id_unidad_administrativa',
  authenticateToken,
  checkPermission('seguimiento-acciones:acciones-control:list'),
  accionesControlController.listAccionesControlPorUnidad
);

// 2. Consultar acción por ID
router.get(
  '/seguimiento-acciones/acciones-control/:id',
  authenticateToken,
  checkPermission('seguimiento-acciones:acciones-control:read'),
  accionesControlController.getAccionControlById
);

module.exports = router;
