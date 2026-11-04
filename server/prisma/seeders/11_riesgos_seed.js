const { prisma } = require('../../src/config/prisma');

async function seedRiesgos() {
  const riesgosData = [
    {
      anio: 2026,
      numero: 1,
      descripcion: 'Falta de seguimiento a las acciones de control.',
      solucion: 'Realizar seguimiento trimestral.'
    },
    {
      anio: 2026,
      numero: 2,
      descripcion: 'Retraso en el cumplimiento de las acciones.',
      solucion: 'Establecer fechas de seguimiento y responsables.'
    },
    {
      anio: 2026,
      numero: 3,
      descripcion: 'Falta de evidencia documental.',
      solucion: 'Solicitar y almacenar evidencias de cada acción.'
    }
  ];

  const riesgos = [];
  for (const riesgo of riesgosData) {
    const r = await prisma.riesgo.create({ data: riesgo });
    riesgos.push(r);
  }
  return riesgos;
}

async function main() {
  const riesgos = await seedRiesgos();
  console.log(`Seeder de Riesgos ejecutado correctamente ✅ (${riesgos.length} riesgos insertados)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
