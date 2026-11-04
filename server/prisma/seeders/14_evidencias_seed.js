const { prisma } = require('../../src/config/prisma');

async function seedEvidencias() {
  const evidenciasData = [
    {
      id_reporte: 1,
      formato: 'PDF',
      ruta: '/evidencias/seguimiento_accion_1.pdf',
      estado: 'APROBADO',
      id_usuario_reporta: 2,
      id_usuario_revisa: 3
    },
    {
      id_reporte: 2,
      formato: 'JPEG',
      ruta: '/evidencias/avance_accion_2.jpg',
      estado: 'EN_REVISION',
      id_usuario_reporta: 2,
      id_usuario_revisa: 3
    },
    {
      id_reporte: 3,
      formato: 'PDF',
      ruta: '/evidencias/avance_accion_2_trimestre_2.pdf',
      estado: 'PENDIENTE',
      id_usuario_reporta: 2,
      id_usuario_revisa: null
    },
    {
      id_reporte: 4,
      formato: 'PNG',
      ruta: '/evidencias/evidencia_accion_3.png',
      estado: 'APROBADO',
      id_usuario_reporta: 2,
      id_usuario_revisa: 3
    },
    {
      id_reporte: 5,
      formato: 'PDF',
      ruta: '/evidencias/evidencia_accion_3_trimestre_2.pdf',
      estado: 'RECHAZADO',
      id_usuario_reporta: 2,
      id_usuario_revisa: 3
    }
  ];

  const evidencias = [];
  for (const evidencia of evidenciasData) {
    const e = await prisma.evidencia.create({ data: evidencia });
    evidencias.push(e);
  }
  return evidencias;
}

async function main() {
  const evidencias = await seedEvidencias();
  console.log(`Seeder de Evidencias ejecutado correctamente ✅ (${evidencias.length} evidencias insertadas)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
