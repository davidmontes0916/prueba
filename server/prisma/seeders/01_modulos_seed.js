const { prisma } = require('../../src/config/prisma');

async function seedModulos() {
  const modulosData = [
    {
      nombre: 'matriz-seguimiento',
      descripcion: 'Gestión y seguimiento de riesgos y acciones de control',
      ruta: '/matriz-seguimiento',
      icono: 'table'
    },
    {
      nombre: 'mapa-riesgos',
      descripcion: 'Visualización y análisis de la matriz impacto vs probabilidad',
      ruta: '/mapa-riesgos',
      icono: 'chart-column'
    },
    {
      nombre: 'ptar-matriz-riesgos',
      descripcion: 'Consulta del PTAR y la matriz de riesgos',
      ruta: '/ptar-matriz-riesgos',
      icono: 'book'
    },
    {
      nombre: 'seguimiento-acciones',
      descripcion: 'Control y estatus de avance de las acciones de control',
      ruta: '/seguimiento-acciones',
      icono: 'check-to-slot'
    },
    {
      nombre: 'gestion-evidencias',
      descripcion: 'Listado, revisión y administración de evidencias',
      ruta: '/gestion-evidencias',
      icono: 'folder-open'
    },
    {
      nombre: 'informes',
      descripcion: 'Generación de informes en distintos formatos del sistema',
      ruta: '/informes',
      icono: 'file-lines'
    },
    {
      nombre: 'dashboard-ejecutivo',
      descripcion: 'Panel principal de indicadores y visualización gráfica de avances',
      ruta: '/dashboard',
      icono: 'chart-pie'
    },
    {
      nombre: 'panel-admin',
      descripcion: 'Configuración de usuarios, roles, permisos y parámetros del sistema',
      ruta: '/admin',
      icono: 'user-shield'
    }
  ];

  const modulos = [];

  for (const modulo of modulosData) {
    const m = await prisma.modulo.create({
      data: modulo
    });
    modulos.push(m);
  }

  return modulos;
}

async function main() {
  await seedModulos();
  console.log('Seeder de Módulos ejecutado correctamente ✅');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
