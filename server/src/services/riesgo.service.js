const { prisma } = require('../config/prisma');

// Crear riesgo: El backend calcula el número secuencial para el año indicado
async function createRiesgo(data) {
  const { anio, descripcion, solucion } = data;
  const targetAnio = anio ? Number(anio) : new Date().getFullYear();

  const ultimoRiesgo = await prisma.riesgo.findFirst({
    where: { anio: targetAnio },
    orderBy: { numero: 'desc' }
  });

  const siguienteNumero = ultimoRiesgo ? ultimoRiesgo.numero + 1 : 1;

  const nuevoRiesgo = await prisma.riesgo.create({
    data: {
      anio: targetAnio,
      numero: siguienteNumero,
      descripcion,
      solucion: solucion || null
    }
  });

  return {
    ...nuevoRiesgo,
    clave: `${nuevoRiesgo.anio}-${String(nuevoRiesgo.numero).padStart(2, '0')}`
  };
}

// Actualizar riesgo: Si cambia el año, recalcula el número para el nuevo año
async function updateRiesgo(id_riesgo, data) {
  const { anio, descripcion, solucion } = data;
  const targetAnio = anio ? Number(anio) : null;

  // Buscamos el riesgo actual para comparar si el año cambió
  const riesgoActual = await prisma.riesgo.findUnique({
    where: { id_riesgo: Number(id_riesgo) }
  });

  if (!riesgoActual) throw new Error('Riesgo no encontrado');

  let nuevoNumero = riesgoActual.numero;

  // Si el año cambió, calculamos un nuevo número secuencial para ese nuevo año
  if (targetAnio && targetAnio !== riesgoActual.anio) {
    const ultimoRiesgoNuevoAnio = await prisma.riesgo.findFirst({
      where: { anio: targetAnio },
      orderBy: { numero: 'desc' }
    });
    nuevoNumero = ultimoRiesgoNuevoAnio ? ultimoRiesgoNuevoAnio.numero + 1 : 1;
  }

  const riesgoActualizado = await prisma.riesgo.update({
    where: { id_riesgo: Number(id_riesgo) },
    data: {
      anio: targetAnio || riesgoActual.anio,
      numero: nuevoNumero,
      descripcion,
      solucion: solucion || null
    }
  });

  return {
    ...riesgoActualizado,
    clave: `${riesgoActualizado.anio}-${String(riesgoActualizado.numero).padStart(2, '0')}`
  };
}

async function listRiesgos() {
  const riesgos = await prisma.riesgo.findMany({
    orderBy: [{ anio: 'desc' }, { numero: 'asc' }]
  });
  return riesgos.map(r => ({
    ...r,
    clave: `${r.anio}-${String(r.numero).padStart(2, '0')}`
  }));
}

async function getRiesgoById(id_riesgo) {
  const riesgo = await prisma.riesgo.findUnique({
    where: { id_riesgo: Number(id_riesgo) }
  });
  if (!riesgo) return null;
  return {
    ...riesgo,
    clave: `${riesgo.anio}-${String(riesgo.numero).padStart(2, '0')}`
  };
}

async function deleteRiesgo(id_riesgo) {
  return prisma.riesgo.delete({
    where: { id_riesgo: Number(id_riesgo) }
  });
}

module.exports = {
  createRiesgo,
  listRiesgos,
  getRiesgoById,
  updateRiesgo,
  deleteRiesgo
};
