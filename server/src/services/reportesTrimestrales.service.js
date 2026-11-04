const { prisma } = require('../config/prisma');

// 3. Crear reporte trimestral
async function createReporteTrimestral(data) {
  const idAccion = Number(data.id_accion);
  const trimestre = Number(data.trimestre);

  if (!Number.isInteger(idAccion) || idAccion <= 0) {
    throw new Error('El ID de la acción no es válido');
  }

  if (!Number.isInteger(trimestre) || trimestre < 1 || trimestre > 4) {
    throw new Error('El trimestre debe ser un número del 1 al 4');
  }

  const accion = await prisma.accionControl.findUnique({
    where: { id_accion: idAccion }
  });

  if (!accion) {
    throw new Error('La acción de control no existe');
  }

  const existente = await prisma.reporteTrimestral.findFirst({
    where: {
      id_accion: idAccion,
      trimestre
    }
  });

  if (existente) {
    throw new Error('Ya existe un reporte para esa acción y trimestre');
  }

  const porcentaje =
    data.porcentaje_avance_trimestral === undefined
      ? 0
      : Number(data.porcentaje_avance_trimestral);

  if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
    throw new Error('El porcentaje debe estar entre 0 y 100');
  }

  return prisma.reporteTrimestral.create({
    data: {
      id_accion: idAccion,
      trimestre,
      porcentaje_avance_trimestral: porcentaje,
      observaciones: data.observaciones || null
    },
    include: {
      accion: true
    }
  });
}

// 4. Listar reportes trimestrales
async function listReportesTrimestrales() {
  return prisma.reporteTrimestral.findMany({
    include: {
      accion: true,
      evidencias: true,
      comentarios: true
    },
    orderBy: [
      { id_accion: 'asc' },
      { trimestre: 'asc' }
    ]
  });
}

// 5. Consultar reporte por ID
async function getReporteTrimestralById(id) {
  const idReporte = Number(id);

  if (!Number.isInteger(idReporte) || idReporte <= 0) {
    throw new Error('El ID del reporte no es válido');
  }

  return prisma.reporteTrimestral.findUnique({
    where: { id_reporte: idReporte },
    include: {
      accion: true,
      evidencias: true,
      comentarios: true
    }
  });
}

// 6. Actualizar reporte por ID
async function updateReporteTrimestral(id, data) {
  const idReporte = Number(id);

  if (!Number.isInteger(idReporte) || idReporte <= 0) {
    throw new Error('El ID del reporte no es válido');
  }

  const actual = await prisma.reporteTrimestral.findUnique({
    where: { id_reporte: idReporte }
  });

  if (!actual) {
    throw new Error('Reporte trimestral no encontrado');
  }

  const cambios = {};

  if (data.id_accion !== undefined) {
    const idAccion = Number(data.id_accion);

    if (!Number.isInteger(idAccion) || idAccion <= 0) {
      throw new Error('El ID de la acción no es válido');
    }

    const accion = await prisma.accionControl.findUnique({
      where: { id_accion: idAccion }
    });

    if (!accion) {
      throw new Error('La acción de control no existe');
    }

    cambios.id_accion = idAccion;
  }

  if (data.trimestre !== undefined) {
    const trimestre = Number(data.trimestre);

    if (!Number.isInteger(trimestre) || trimestre < 1 || trimestre > 4) {
      throw new Error('El trimestre debe ser un número del 1 al 4');
    }

    cambios.trimestre = trimestre;
  }

  if (data.porcentaje_avance_trimestral !== undefined) {
    const porcentaje = Number(data.porcentaje_avance_trimestral);

    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }

    cambios.porcentaje_avance_trimestral = porcentaje;
  }

  if (data.observaciones !== undefined) {
    cambios.observaciones = data.observaciones || null;
  }

  const idAccionFinal = cambios.id_accion ?? actual.id_accion;
  const trimestreFinal = cambios.trimestre ?? actual.trimestre;

  const duplicado = await prisma.reporteTrimestral.findFirst({
    where: {
      id_accion: idAccionFinal,
      trimestre: trimestreFinal,
      NOT: {
        id_reporte: idReporte
      }
    }
  });

  if (duplicado) {
    throw new Error('Ya existe un reporte para esa acción y trimestre');
  }

  return prisma.reporteTrimestral.update({
    where: { id_reporte: idReporte },
    data: cambios,
    include: {
      accion: true
    }
  });
}

// 7. Eliminar reporte por ID
async function deleteReporteTrimestral(id) {
  const idReporte = Number(id);

  if (!Number.isInteger(idReporte) || idReporte <= 0) {
    throw new Error('El ID del reporte no es válido');
  }

  const reporte = await prisma.reporteTrimestral.findUnique({
    where: { id_reporte: idReporte }
  });

  if (!reporte) {
    throw new Error('Reporte trimestral no encontrado');
  }

  return prisma.reporteTrimestral.delete({
    where: { id_reporte: idReporte }
  });
}

module.exports = {
  createReporteTrimestral,
  listReportesTrimestrales,
  getReporteTrimestralById,
  updateReporteTrimestral,
  deleteReporteTrimestral
};