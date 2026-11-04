const { prisma } = require('../../src/config/prisma');

async function main() {
  console.log('🚀 Iniciando seeder de asignación de permisos al Administrador...');

  // 1. Buscar el rol Administrador
  const rolAdmin = await prisma.rol.findUnique({ 
    where: { nombre: 'Administrador' } 
  });
  
  if (!rolAdmin) {
    throw new Error('Falta el rol "Administrador". Ejecuta primero el seeder de roles.');
  }

  // 2. Obtener todos los permisos registrados en el sistema
  const permisos = await prisma.permiso.findMany();
  if (permisos.length === 0) {
    throw new Error('No hay permisos registrados. Ejecuta primero el seeder de permisos.');
  }

  let procesados = 0;

  // 3. Asignar todos los permisos al Administrador de forma segura
  for (const permiso of permisos) {
    await prisma.rolPermiso.upsert({
      where: {
        // Nota: Asegúrate de que en tu schema.prisma la llave única compuesta 
        // entre id_rol e id_permiso se llame de esta forma (es el estándar de Prisma).
        id_rol_id_permiso: {
          id_rol: rolAdmin.id_rol,
          id_permiso: permiso.id_permiso
        }
      },
      update: {}, // Si ya existe la relación, no hace nada
      create: {
        id_rol: rolAdmin.id_rol,
        id_permiso: permiso.id_permiso
      }
    });
    procesados++;
  }

  console.log(`✅ Seeder de RolPermiso ejecutado correctamente (${procesados} permisos vinculados al Administrador).`);
}

main()
  .catch(e => { 
    console.error('❌ Error crítico en el seeder de RolPermiso:', e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });
