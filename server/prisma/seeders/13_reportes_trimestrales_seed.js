const { prisma } = require('../../src/config/prisma');

async function seedReportes() {
  const reportesData = [
    { id_accion: 1, trimestre: 1, porcentaje_avance_trimestral: 100, observaciones: 'La acción fue completada correctamente.' },
    { id_accion: 2, trimestre: 1, porcentaje_avance_trimestral: 50,  observaciones: 'La acción presenta avances.' },
    { id_accion: 2, trimestre: 2, porcentaje_avance_trimestral: 25,  observaciones: 'La acción continúa en proceso.' },
    { id_accion: 3, trimestre: 1, porcentaje_avance_trimestral: 25,  observaciones: 'Se inició la recopilación de evidencias.' },
    { id_accion: 3, trimestre: 2, porcentaje_avance_trimestral: 25,  observaciones: 'Continúa la recopilación de documentos.' }
  ];

  const reportes = [];
  for (const reporte of reportesData) {
    const r = await prisma.reporteTrimestral.create({ data: reporte });
    reportes.push(r);
  }
  return reportes;
}

async function main() {
  const reportes = await seedReportes();
  console.log(`Seeder de Reportes Trimestrales ejecutado correctamente ✅ (${reportes.length} reportes insertados)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
