const express = require('express');
console.log(' comentarios.routes.js cargado correctamente');

const router = express.Router();

const comentariosController = require('../controllers/comentarios.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

// CREATE: crear comentario
router.post('/comentarios',
  authenticateToken,
  checkPermission(ID_RECURSO_COMENTARIOS, 1),
  comentariosController.createComentario
);

// LIST: listar comentarios
router.get('/comentarios',
  authenticateToken,
  checkPermission(ID_RECURSO_COMENTARIOS, 5),
  comentariosController.listComentarios
);

// READ: consultar comentario por ID
router.get('/comentarios/:id',
  authenticateToken,
  checkPermission(ID_RECURSO_COMENTARIOS, 2),
  comentariosController.getComentarioById
);

// UPDATE: actualizar comentario
router.put('/comentarios/:id',
  authenticateToken,
  checkPermission(ID_RECURSO_COMENTARIOS, 3),
  comentariosController.updateComentario
);

// DELETE: eliminar comentario
router.delete('/comentarios/:id',
  authenticateToken,
  checkPermission(ID_RECURSO_COMENTARIOS, 4),
  comentariosController.deleteComentario
);

module.exports = router;