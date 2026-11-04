const { prisma } = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser({ nombre, apellido_paterno, apellido_materno, correo, contrasena }) {
  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  // Crear usuario
  const user = await prisma.usuario.create({
    data: {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena: hashedPassword,
      estado: 'Activo'
    }
  });

  return user;
}

async function loginUser(correo, contrasena) {
  const user = await prisma.usuario.findUnique({
    where: { correo },
    include: {
      usuario_roles: {
        include: {
          rol: {
            include: {
              rol_permisos: {
                include: {
                  permiso: { include: { modulo: true, accion: true } }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) throw new Error('Usuario no encontrado');

  const validPassword = await bcrypt.compare(contrasena, user.contrasena);
  if (!validPassword) throw new Error('Contraseña incorrecta');

  // 1. Extraer y agrupar los módulos con sus acciones
  const modulesMap = new Map();

  user.usuario_roles.forEach(ur => {
    ur.rol.rol_permisos.forEach(rp => {
      const mod = rp.permiso.modulo;
      const accionNombre = rp.permiso.accion.nombre;

      if (!modulesMap.has(mod.id_modulo)) {
        modulesMap.set(mod.id_modulo, {
          id_modulo: mod.id_modulo,
          nombre: mod.nombre,
          descripcion: mod.descripcion || '',
          ruta: mod.ruta || '',
          icono: mod.icono || '',
          acciones: []
        });
      }

      const moduloActual = modulesMap.get(mod.id_modulo);
      if (!moduloActual.acciones.includes(accionNombre)) {
        moduloActual.acciones.push(accionNombre);
      }
    });
  });

  const modules = Array.from(modulesMap.values());

  // 2. Firmar el token
  const token = jwt.sign(
    { 
      id_usuario: user.id_usuario, 
      correo: user.correo, 
      modules: modules.map(m => m.nombre) 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 3. Limpiar la contraseña y los roles anidados del objeto user
  const { contrasena: _, usuario_roles, ...userWithoutPassword } = user;

  // 4. Retornar incluyendo "modules" que faltaba en el objeto de salida
  return { 
    token, 
    user: userWithoutPassword, 
    modules // <--- ¡Aquí estaba el detalle que faltaba incorporar en el return!
  };
}

module.exports = { registerUser, loginUser };
