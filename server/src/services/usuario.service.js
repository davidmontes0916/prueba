const { prisma } = require('../config/prisma');
const bcrypt = require('bcryptjs');

// Crear usuario
async function createUsuario(data) {
  // Extraemos id_rol e id_unidad_administrativa para evitar errores en Prisma
  const { id_rol, id_unidad_administrativa, contrasena, ...restoDatos } = data;
  
  const hashedPassword = await bcrypt.hash(contrasena, 10);
  
  // 1. Creamos el usuario limpio
  const nuevoUsuario = await prisma.usuario.create({
    data: {
      ...restoDatos,
      contrasena: hashedPassword,
      estado: data.estado || 'Activo',
      id_unidad_administrativa: id_unidad_administrativa ? Number(id_unidad_administrativa) : null
    }
  });

  // 2. Si se seleccionó un rol, lo asignamos en la tabla pivote
  if (id_rol) {
    await asignarRolUsuario(nuevoUsuario.id_usuario, Number(id_rol));
  }

  return nuevoUsuario;
}

// Listar usuarios con campos específicos
// Listar usuarios con campos específicos
async function listUsuarios() {
  return prisma.usuario.findMany({
    select: {
      id_usuario: true,
      nombre: true,
      apellido_paterno: true,
      apellido_materno: true,
      correo: true,
      estado: true,
      telefono_1: true,
      telefono_2: true,
      fecha_registro: true, // <--- ¡Añade esta línea aquí!
      id_unidad_administrativa: true,
      usuario_roles: {
        select: {
          rol: {
            select: {
              id_rol: true,
              nombre: true
            }
          }
        }
      }
    }
  });
}

// Consultar usuario por ID
async function getUsuarioById(id_usuario) {
  return prisma.usuario.findUnique({ 
    where: { id_usuario: Number(id_usuario) },
    select: {
      id_usuario: true,
      nombre: true,
      apellido_paterno: true,
      apellido_materno: true,
      correo: true,
      telefono_1: true,
      telefono_2: true,
      estado: true,
      fecha_registro: true,
      id_unidad_administrativa: true,
      usuario_roles: {
        select: {
          rol: { select: { id_rol: true, nombre: true } }
        }
      }
    }
  });
}

// Editar usuario
async function updateUsuario(id_usuario, data) {
  const { id_rol, id_unidad_administrativa, contrasena, correo, ...restoDatos } = data;
  
  const updateData = { ...restoDatos };
  
  if (contrasena) {
    updateData.contrasena = await bcrypt.hash(contrasena, 10);
  }
  
  if (id_unidad_administrativa !== undefined) {
    updateData.id_unidad_administrativa = id_unidad_administrativa ? Number(id_unidad_administrativa) : null;
  }

  // Actualizar datos básicos del usuario
  const usuarioActualizado = await prisma.usuario.update({
    where: { id_usuario: Number(id_usuario) },
    data: updateData
  });

  // Si se envió un rol, actualizamos la relación en la tabla pivote
  if (id_rol !== undefined && id_rol !== '') {
    // Eliminamos roles anteriores y asignamos el nuevo
    await prisma.usuarioRol.deleteMany({ where: { id_usuario: Number(id_usuario) } });
    await asignarRolUsuario(Number(id_usuario), Number(id_rol));
  }

  return usuarioActualizado;
}

// Actualizar estatus del usuario
async function updateStatusUsuario(id_usuario, estado) {
  return prisma.usuario.update({
    where: { id_usuario: Number(id_usuario) },
    data: { estado }
  });
}

// Eliminar usuario
async function deleteUsuario(id_usuario) {
  return prisma.usuario.delete({ where: { id_usuario: Number(id_usuario) } });
}

// Asignar un rol a un usuario
async function asignarRolUsuario(id_usuario, id_rol) {
  const usuario = await prisma.usuario.findUnique({ where: { id_usuario: Number(id_usuario) } });
  if (!usuario) throw new Error('Usuario no encontrado');

  const rol = await prisma.rol.findUnique({ where: { id_rol: Number(id_rol) } });
  if (!rol) throw new Error('Rol no encontrado');

  return prisma.usuarioRol.upsert({
    where: {
      id_usuario_id_rol: {
        id_usuario: Number(id_usuario),
        id_rol: Number(id_rol)
      }
    },
    update: {},
    create: {
      id_usuario: Number(id_usuario),
      id_rol: Number(id_rol)
    },
    include: {
      rol: { select: { nombre: true } },
      usuario: { select: { correo: true, nombre: true } }
    }
  });
}

module.exports = {
  createUsuario,
  listUsuarios,
  getUsuarioById,
  updateUsuario,
  updateStatusUsuario,
  deleteUsuario,
  asignarRolUsuario
};
