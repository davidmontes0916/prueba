const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Guardar metadatos de la evidencia en la BD
exports.createEvidencia = async (evidenciaData, idUsuario) => {
  return await prisma.archivo.create({
    data: {
      nombre: evidenciaData.nombre,
      formato: evidenciaData.formato,
      tipo: evidenciaData.tipo,
      ruta: evidenciaData.ruta,
      id_usuario: Number(idUsuario)
    }
  });
};

// 2. Listar todas las evidencias registradas
exports.listEvidencias = async () => {
  return await prisma.archivo.findMany({
    include: {
      usuario: {
        select: {
          nombre: true,
          correo: true
        }
      }
    }
  });
};

// 3. Obtener una evidencia por su ID
exports.getEvidenciaById = async (id) => {
  return await prisma.archivo.findUnique({
    where: {
      id_archivo: Number(id)
    },
    include: {
      usuario: {
        select: {
          nombre: true
        }
      }
    }
  });
};

// 4. Actualizar únicamente el estatus de la evidencia
exports.updateStatusEvidencia = async (id, estado) => {

  // Verificar que la evidencia exista
  const evidenciaExistente = await prisma.archivo.findUnique({
    where: {
      id_archivo: Number(id)
    }
  });

  if (!evidenciaExistente) {
    throw new Error('Evidencia no encontrada');
  }

  // Actualizar solamente el campo estado
  return await prisma.archivo.update({
    where: {
      id_archivo: Number(id)
    },
    data: {
      estado: estado
    }
  });
};

// 5. Eliminar una evidencia por su ID
exports.deleteEvidencia = async (id) => {
  return await prisma.archivo.delete({
    where: {
      id_archivo: Number(id)
    }
  });
};