const { prisma } = require('../../src/config/prisma');
const bcrypt = require('bcryptjs');

async function seedUsuarios() {
  const hashedAdmin = await bcrypt.hash('admin', 10);
  const hashedUser  = await bcrypt.hash('user', 10);

  const usuariosData = [
    {
      nombre: 'Admin',
      apellido_paterno: 'Sistema',
      apellido_materno: null,
      correo: 'admin@ssiptar.com',
      contrasena: hashedAdmin,
      telefono_1: '5550000001',
      estado: 'Activo',
      id_unidad_administrativa: 1
    },
    {
      nombre: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'López',
      correo: 'juan@ssiptar.com',
      contrasena: hashedUser,
      telefono_1: '5550000002',
      estado: 'Activo',
    },
    {
      nombre: 'María',
      apellido_paterno: 'González',
      apellido_materno: 'Sánchez',
      correo: 'maria@ssiptar.com',
      contrasena: hashedUser,
      telefono_1: '5550000003',
      estado: 'Activo',
      id_unidad_administrativa: 2
    }
  ];

  const usuarios = [];
  for (const usuario of usuariosData) {
    const u = await prisma.usuario.create({ data: usuario });
    usuarios.push(u);
  }
  return usuarios;
}

async function main() {
  const usuarios = await seedUsuarios();
  console.log(`Seeder de Usuarios ejecutado correctamente ✅ (${usuarios.length} usuarios insertados)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });