const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Guardar metadatos del archivo en la BD
exports.createArchivo = async (fileData, idUsuario) => {
  return await prisma.archivo.create({
    data: {
      nombre: fileData.nombre,
      formato: fileData.formato, 
      tipo: fileData.tipo,       
      ruta: fileData.ruta,
      id_usuario: Number(idUsuario)
    }
  });
};

// 2. Listar todos los archivos registrados
exports.listArchivos = async () => {
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

// 3. Obtener un archivo por su ID primario
exports.getArchivoById = async (id) => {
  return await prisma.archivo.findUnique({
    where: { id_archivo: Number(id) },
    include: {
      usuario: {
        select: {
          nombre: true
        }
      }
    }
  });
};

exports.deleteArchivo = async (id) => {
  return await prisma.archivo.delete({
    where: { id_archivo: Number(id) }
  });
};
