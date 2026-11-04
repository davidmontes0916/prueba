const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsable.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

// CRUD Responsables con permisos (recurso Responsables id = ?)
router.post('/responsables',
  authenticateToken,
  checkPermission('panel-admin:responsables:create'), 
    responsableController.createResponsable
);

router.get('/responsables',
  authenticateToken,
  checkPermission('panel-admin:responsables:list'), 
  responsableController.listResponsables
);

router.get('/responsables/:id',
  authenticateToken,
  checkPermission('panel-admin:responsables:read'), // recurso Responsables, acción read
  responsableController.getResponsableById
);

router.put('/responsables/:id',
  authenticateToken,
  checkPermission('panel-admin:responsables:update'), // recurso Responsables, acción update
  responsableController.updateResponsable
);

router.delete('/responsables/:id',
  authenticateToken,
  checkPermission('panel-admin:responsables:delete'),  // recurso Responsables, acción delete
  responsableController.deleteResponsable
);

module.exports = router;
