// src/middleware/permission.middleware.js
const { prisma } = require('../config/prisma');

function checkPermission(requiredPermissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id_usuario;

      if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // Buscar roles del usuario con sus permisos cargados
      const roles = await prisma.usuarioRol.findMany({
        where: { id_usuario: userId },
        include: {
          rol: {
            include: {
              rol_permisos: {
                include: {
                  permiso: true // Ya no necesitamos incluir recurso ni acción por separado
                }
              }
            }
          }
        }
      });

      // Validar si alguno de los roles del usuario posee el permiso exacto por nombre
      const hasPermission = roles.some(ur =>
        ur.rol.rol_permisos.some(rp =>
          rp.permiso && rp.permiso.nombre === requiredPermissionName
        )
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Acceso denegado: No cuentas con los privilegios necesarios para esta acción.' 
        });
      }

      next();
    } catch (error) {
      console.error('Error en autorización:', error);
      res.status(500).json({ error: 'Error interno en el proceso de autorización' });
    }
  };
}

module.exports = { checkPermission };
