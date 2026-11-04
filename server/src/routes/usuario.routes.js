const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

// CRUD de Usuarios estructurado con el nombre del módulo en la ruta
router.post('/panel-admin/usuarios',
  authenticateToken,
  checkPermission('panel-admin:usuarios:create'), 
  usuarioController.createUsuario
);

router.get('/panel-admin/usuarios',
  authenticateToken,
  checkPermission('panel-admin:usuarios:list'), 
  usuarioController.listUsuarios
);

router.get('/panel-admin/usuarios/:id',
  authenticateToken,
  checkPermission('panel-admin:usuarios:read'), 
  usuarioController.getUsuarioById
);

router.put('/panel-admin/usuarios/:id',
  authenticateToken,
  checkPermission('panel-admin:usuarios:update'), 
  usuarioController.updateUsuario
);

router.delete('/panel-admin/usuarios/:id',
  authenticateToken,
  checkPermission('panel-admin:usuarios:delete'), 
  usuarioController.deleteUsuario
);

// Ruta para actualizar estatus con prefijo de módulo
router.patch('/panel-admin/usuarios/:id/status',
  authenticateToken,
  checkPermission('panel-admin:usuarios:status-update'), 
  usuarioController.updateStatusUsuario
);

// Asignar rol a un usuario específico
router.post('/panel-admin/usuarios/:id/roles',
  authenticateToken,
  checkPermission('panel-admin:usuarios:assign'),
  usuarioController.asignarRol
);

module.exports = router;
