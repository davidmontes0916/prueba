const { prisma } = require('../../src/config/prisma');

async function seedAccionesControl() {
  const accionesData = [
    {
      id_riesgo: 1,
      numero: 1,
      descripcion: 'Realizar seguimiento trimestral al riesgo identificado.',
      medios_verificacion: 'Informe de seguimiento trimestral.',
      id_unidad_administrativa: 1,
      id_responsable: 1,
      fecha_inicio: new Date('2026-01-01T00:00:00'),
      fecha_termino: new Date('2026-12-31T23:59:59'),
      porcentaje_acumulado: 100,
      cumplida: true
    },
    {
      id_riesgo: 2,
      numero: 2,
      descripcion: 'Implementar medidas para reducir el retraso de las acciones.',
      medios_verificacion: 'Reporte de implementación.',
      id_unidad_administrativa: 1,
      id_responsable: 2,
      fecha_inicio: new Date('2026-01-01T00:00:00'),
      fecha_termino: new Date('2026-12-31T23:59:59'),
      porcentaje_acumulado: 75,
      cumplida: false
    },
    {
      id_riesgo: 3,
      numero: 3,
      descripcion: 'Recopilar y almacenar evidencias documentales.',
      medios_verificacion: 'Documentos y archivos de evidencia.',
      id_unidad_administrativa: 2,
      id_responsable: 1,
      fecha_inicio: new Date('2026-01-01T00:00:00'),
      fecha_termino: new Date('2026-12-31T23:59:59'),
      porcentaje_acumulado: 50,
      cumplida: false
    }
  ];

  const acciones = [];
  for (const accion of accionesData) {
    const a = await prisma.accionControl.create({ data: accion });
    acciones.push(a);
  }
  return acciones;
}

async function main() {
  const acciones = await seedAccionesControl();
  console.log(`Seeder de Acciones de Control ejecutado correctamente ✅ (${acciones.length} acciones insertadas)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });