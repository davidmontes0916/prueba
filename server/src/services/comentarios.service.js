const { prisma } = require('../config/prisma');

// 1. Crear comentario
async function createComentario(data) {
  const { contenido, id_usuario, id_evidencia } = data;

  if (!contenido || !contenido.trim()) {
    throw new Error('El contenido del comentario es obligatorio');
  }

  if (!id_evidencia) {
    throw new Error('El ID de la evidencia es obligatorio');
  }

  const evidenciaExiste = await verificarEvidencia(id_evidencia);

  if (!evidenciaExiste) {
    throw new Error('Evidencia no encontrada');
  }

  const usuarioExisteResultado = await usuarioExiste(id_usuario);

  if (!usuarioExisteResultado) {
    throw new Error('Usuario no encontrado');
  }

  return await prisma.comentario.create({
    data: {
      contenido: contenido.trim(),
      id_usuario: Number(id_usuario),
      id_evidencia: Number(id_evidencia)
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido_paterno: true,
          correo: true
        }
      },
      evidencia: true
    }
  });
}

// 2. Listar comentarios
async function listComentarios() {
  return await prisma.comentario.findMany({
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido_paterno: true,
          correo: true
        }
      },
      evidencia: true
    }
  });
}

// 3. Consultar comentario por ID
async function getComentarioById(id_comentario) {
  return await prisma.comentario.findUnique({
    where: {
      id_comentario: Number(id_comentario)
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido_paterno: true,
          correo: true
        }
      },
      evidencia: true
    }
  });
}

// 4. Actualizar comentario
async function updateComentario(id_comentario, data) {
  const comentarioExiste = await getComentarioById(id_comentario);

  if (!comentarioExiste) {
    throw new Error('Comentario no encontrado');
  }

  if (
    typeof data.contenido !== 'string' ||
    !data.contenido.trim()
  ) {
    throw new Error('El contenido del comentario es obligatorio');
  }

  return await prisma.comentario.update({
    where: {
      id_comentario: Number(id_comentario)
    },
    data: {
      contenido: data.contenido.trim()
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido_paterno: true,
          correo: true
        }
      },
      evidencia: true
    }
  });
}

// 5. Eliminar comentario
async function deleteComentario(id_comentario) {
  const comentarioExiste = await getComentarioById(id_comentario);

  if (!comentarioExiste) {
    throw new Error('Comentario no encontrado');
  }

  return await prisma.comentario.delete({
    where: {
      id_comentario: Number(id_comentario)
    }
  });
}

// 6. Verificar que la evidencia exista
async function verificarEvidencia(id_evidencia) {
  const evidencia = await prisma.evidencia.findUnique({
    where: {
      id_evidencia: Number(id_evidencia)
    }
  });

  return !!evidencia;
}

// 7. Verificar que el usuario exista
async function usuarioExiste(id_usuario) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id_usuario: Number(id_usuario)
    }
  });

  return !!usuario;
}

module.exports = {
  createComentario,
  listComentarios,
  getComentarioById,
  updateComentario,
  deleteComentario,
  verificarEvidencia,
  usuarioExiste
};