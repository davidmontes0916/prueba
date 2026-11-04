const { prisma } = require('../config/prisma');

async function createMapaRiesgo(data) {
  return await prisma.archivo.create({ data });
}

async function deleteMapaRiesgo(id_archivo) {
  return await prisma.archivo.delete({ where: { id_archivo } });
}

async function getMapaRiesgoById(id_archivo) {
  return await prisma.archivo.findUnique({ where: { id_archivo } });
}

module.exports = {
  createMapaRiesgo,
  deleteMapaRiesgo,
  getMapaRiesgoById
}

module.exports = {
  createMapaRiesgo,
  deleteMapaRiesgo,
  getMapaRiesgoById
};
