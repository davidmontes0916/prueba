const { prisma } = require('../../src/config/prisma');

async function seedRecursos() {
  const recursosData = [
    // 1. Matriz de seguimiento
    {
      nombre: 'riesgos',
      descripcion: 'Gestión de riesgos identificados en la matriz'
    },
    {
      nombre: 'acciones-control',
      descripcion: 'Gestión y control de acciones (compartido entre Matriz y Seguimiento)'
    },

    // 2. Mapa de riesgos y PTAR (Unificados ya que comparten el recurso de archivos)
    {
      nombre: 'archivos',
      descripcion: 'Gestión de documentos, archivos e informes del mapa de riesgos y PTAR'
    },

    // 3. Seguimiento de acciones y Gestión de evidencias (Recursos unificados)
    {
      nombre: 'reportes-trimestrales',
      descripcion: 'Generación y consulta de reportes trimestrales'
    },
    {
      nombre: 'evidencias',
      descripcion: 'Carga, revisión y gestión de evidencias probatorias'
    },
    {
      nombre: 'comentarios',
      descripcion: 'Comentarios y retroalimentación en evidencias'
    },

    // 4. Informes
    {
      nombre: 'informes',
      descripcion: 'Generación de informes generales del sistema'
    },

    // 5. Dashboard ejecutivo y panel de administración
    {
      nombre: 'metricas',
      descripcion: 'Tablero con métricas e indicadores ejecutivos'
    },
    {
      nombre: 'usuarios',
      descripcion: 'Gestión de usuarios del sistema'
    },
    {
      nombre: 'roles',
      descripcion: 'Gestión de roles'
    },
    {
      nombre: 'permisos',
      descripcion: 'Administración de permisos para los roles'
    },
    {
      nombre: 'unidades-administrativas',
      descripcion: 'Catálogo de unidades administrativas'
    },
    {
      nombre: 'responsables',
      descripcion: 'Catálogo de responsables'
    }
  ];

  const recursos = [];

  for (const recurso of recursosData) {
    const r = await prisma.recurso.create({
      data: recurso
    });

    recursos.push(r);
  }

  return recursos;
}

async function main() {
  const recursos = await seedRecursos();
  console.log(`Seeder de Recursos ejecutado correctamente ✅ (${recursos.length} recursos insertados)`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
