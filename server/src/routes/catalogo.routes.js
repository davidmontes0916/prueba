const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogo.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Rutas para los selectores del panel de administración
router.get('/panel-admin/roles', authenticateToken, catalogoController.getRoles);
router.get('/panel-admin/unidades-administrativas', authenticateToken, catalogoController.getUnidadesAdministrativas);

module.exports = router;
