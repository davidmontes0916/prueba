const { prisma } = require('../../src/config/prisma');

async function seedAcciones() {
  const accionesData = [
    // CRUD + list
    {
      nombre: 'create',
      descripcion: 'Crear registros' 
    },
    {
      nombre: 'read',
      descripcion: 'Consultar registros individuales'
    },
    { 
      nombre: 'list',
      descripcion: 'Listar registros'
    },
    {
      nombre: 'update',
      descripcion: 'Actualizar registros'
    },
    { 
      nombre: 'delete',
      descripcion: 'Eliminar registros'
    },

    // Control operativo y administrativo
    { 
      nombre: 'status-update',
      descripcion: 'Actualizar estado'
    },
    { 
      nombre: 'configure',
      descripcion: 'Configurar'
    },
    { 
      nombre: 'assign',
      descripcion: 'Asignar registros'
    },
    
    // Gestión de archivos
    { 
      nombre: 'upload',
      descripcion: 'Importar archivos'
    },
    { 
      nombre: 'download',
      descripcion: 'Exportar archivos'
    },
    { 
      nombre: 'generate',
      descripcion: 'Generar archivos'
    }
  ];

  const acciones = [];
  for (const accion of accionesData) {
    const a = await prisma.accion.create({ data: accion });
    acciones.push(a);
  }
  return acciones;
}

async function main() {
  const acciones = await seedAcciones();
  console.log(`Seeder de Acciones ejecutado correctamente ✅ (${acciones.length} acciones insertadas)`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  