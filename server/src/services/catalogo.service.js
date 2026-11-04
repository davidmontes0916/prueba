const { prisma } = require('../config/prisma');

async function getRoles() {
  return prisma.rol.findMany({
    where: { estado: 'Activo' },
    select: { id_rol: true, nombre: true }
  });
}

async function getUnidadesAdministrativas() {
  return prisma.unidadesAdministrativas.findMany({
    select: { id_unidad_administrativa: true, nombre: true }
  });
}

module.exports = {
  getRoles,
  getUnidadesAdministrativas
};
