const { prisma } = require('../../src/config/prisma');

async function seedUnidades() {
  const unidadesData = [
    { "nombre": "Secretaría Académica / Direcciones de División" },
    { "nombre": "Departamento de Recursos Humanos y Materiales" },
    { "nombre": "Dirección de Administración y Finanzas" },
    { "nombre": "Dirección de Planeación, Vinculación e Igualdad de Género" },
    { "nombre": "Departamento de Vinculación y Extensión" }
  ]

  const unidades = [];
  for (const unidad of unidadesData) {
    const u = await prisma.unidadesAdministrativas.create({ data: unidad });
    unidades.push(u);
  }
  return unidades;
}

async function main() {
  const unidades = await seedUnidades();
  console.log(`Seeder de Unidades Administrativas ejecutado correctamente ✅ (${unidades.length} unidades insertadas)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
