const { prisma } = require('../../src/config/prisma');

async function seedUsuarioRol() {
  // Buscar los usuarios por correo
  const admin  = await prisma.usuario.findUnique({ where: { correo: 'admin@ssiptar.com' } });
  const juan   = await prisma.usuario.findUnique({ where: { correo: 'juan@ssiptar.com' } });
  const maria  = await prisma.usuario.findUnique({ where: { correo: 'maria@ssiptar.com' } });

  if (!admin || !juan || !maria) {
    throw new Error('Faltan usuarios. Corre 09_usuarios_seed.js primero.');
  }

  // Buscar los roles por nombre (los 4 reales de tu sistema)
  const rolAdmin     = await prisma.rol.findUnique({ where: { nombre: 'Administrador' } });
  const rolEnlace    = await prisma.rol.findUnique({ where: { nombre: 'Enlace de Administración de Riesgos' } });
  const rolDireccion = await prisma.rol.findUnique({ where: { nombre: 'Alta Dirección' } });
  const rolUnidad    = await prisma.rol.findUnique({ where: { nombre: 'Unidad Administrativa' } });

  if (!rolAdmin || !rolEnlace || !rolDireccion || !rolUnidad) {
    throw new Error('Faltan roles. Corre 05_roles_seed.js primero.');
  }

  // Asignaciones
  const asignaciones = [
    { id_usuario: admin.id_usuario,  id_rol: rolAdmin.id_rol },       // Admin → Administrador
    { id_usuario: juan.id_usuario,   id_rol: rolEnlace.id_rol },      // Juan → Enlace de Administración de Riesgos
    { id_usuario: maria.id_usuario,  id_rol: rolUnidad.id_rol }       // María → Unidad Administrativa
  ];

  const resultados = [];
  for (const asignacion of asignaciones) {
    const ur = await prisma.usuarioRol.create({ data: asignacion });
    resultados.push(ur);
  }
  return resultados;
}

async function main() {
  const asignaciones = await seedUsuarioRol();
  console.log(`Seeder de Usuario-Rol ejecutado correctamente ✅ (${asignaciones.length} asignaciones insertadas)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
  