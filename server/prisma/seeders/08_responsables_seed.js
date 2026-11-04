const { prisma } = require('../../src/config/prisma');

async function seedResponsables() {
  const responsablesData = [
    { "nombre": "Secretario Académico / Directoras de División" },
    { "nombre": "Titular del Departamento de Recursos Humanos y Materiales" },
    { "nombre": "Titular de la Dirección de Administración y Finanzas" },
    { "nombre": "Titular de Dirección de Planeación, vinculación e Igualdad de Género" },
    { "nombre": "Titular del Departamento de Vinculación y Extensión" }
  ]

  const responsables = [];
  for (const responsable of responsablesData) {
    const r = await prisma.responsable.create({ data: responsable });
    responsables.push(r);
  }
  return responsables;
}

async function main() {
  const responsables = await seedResponsables();
  console.log(`Seeder de Responsables ejecutado correctamente ✅ (${responsables.length} responsables insertados)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
