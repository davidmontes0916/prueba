const { prisma } = require('../../src/config/prisma');

/**
 * Función auxiliar genérica para crear o actualizar permisos de manera limpia.
 */
async function registrarPermisos(modulo, recurso, accionesNombres, accionPorNombre) {
  for (const nombreAccion of accionesNombres) {
    const accion = accionPorNombre[nombreAccion];

    if (!accion) {
      console.warn(`⚠️ Advertencia: La acción "${nombreAccion}" no existe en la base de datos.`);
      continue;
    }

    // Nomenclatura oficial: modulo:recurso:accion
    const nombrePermiso = `${modulo.nombre}:${recurso.nombre}:${accion.nombre}`;

    await prisma.permiso.upsert({
      where: { nombre: nombrePermiso },
      update: {}, // Si ya existe, no hace nada
      create: {
        nombre: nombrePermiso,
        id_modulo: modulo.id_modulo,
        id_recurso: recurso.id_recurso,
        id_accion: accion.id_accion
      }
    });
  }
}

/**
 * ==========================================
 * 1. MATRIZ DE SEGUIMIENTO
 * ==========================================
 */
async function seedPermisosMatrizRiesgos(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'matriz-seguimiento' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'riesgos' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "matriz-seguimiento" o el recurso "riesgos".');
  }

  const accionesRiesgos = ['create', 'read', 'list', 'delete'];
  await registrarPermisos(modulo, recurso, accionesRiesgos, accionPorNombre);
  console.log('  -> Permisos de matriz-seguimiento:riesgos creados correctamente.');
}

async function seedPermisosMatrizSeguimientoAccionesControl(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'matriz-seguimiento' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'acciones-control' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "matriz-seguimiento" o el recurso "acciones-control".');
  }

  const accionesAccionesControl = ['create', 'read', 'list', 'update', 'delete', 'assign'];
  await registrarPermisos(modulo, recurso, accionesAccionesControl, accionPorNombre);
  console.log('  -> Permisos de matriz-seguimiento:acciones-control creados correctamente.');
}

/**
 * ==========================================
 * 2. MAPA DE RIESGOS
 * ==========================================
 */
async function seedPermisosMapaRiesgosArchivos(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'mapa-riesgos' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'archivos' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "mapa-riesgos" o el recurso "archivos".');
  }

  const accionesArchivos = ['list', 'read', 'upload','delete'];  
  await registrarPermisos(modulo, recurso, accionesArchivos, accionPorNombre);
  console.log('  -> Permisos de mapa-riesgos:archivos creados correctamente.');
}

/**
 * ==========================================
 * 3. PTAR (ptar-matriz-riesgos)
 * ==========================================
 */
async function seedPermisosPtarArchivos(accionPorNombre) {
  // Ajustado al slug oficial del catálogo: 'ptar-matriz-riesgos'
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'ptar-matriz-riesgos' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'archivos' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "ptar-matriz-riesgos" o el recurso "archivos".');
  }

  const accionesArchivos = ['list', 'read', 'upload','delete'];  
  await registrarPermisos(modulo, recurso, accionesArchivos, accionPorNombre);
  console.log('  -> Permisos de ptar-matriz-riesgos:archivos creados correctamente.');
}

/**
 * ==========================================
 * 4. SEGUIMIENTO DE ACCIONES
 * ==========================================
 */
async function seedPermisosSeguimientoAccionesControl(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'seguimiento-acciones' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'acciones-control' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "seguimiento-acciones" o el recurso "acciones-control".');
  }

  const acciones = ['list', 'read'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de seguimiento-acciones:acciones-control creados correctamente.');
}

async function seedPermisosSeguimientoReportesTrimestrales(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'seguimiento-acciones' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'reportes-trimestrales' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "seguimiento-acciones" o el recurso "reportes-trimestrales".');
  }

  const acciones = ['create', 'list', 'read', 'update', 'delete'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de seguimiento-acciones:reportes-trimestrales creados correctamente.');
}

async function seedPermisosSeguimientoEvidencias(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'seguimiento-acciones' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'evidencias' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "seguimiento-acciones" o el recurso "evidencias".');
  }

  const acciones = ['list', 'read', 'delete', 'upload'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de seguimiento-acciones:evidencias creados correctamente.');
}

async function seedPermisosSeguimientoComentarios(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'seguimiento-acciones' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'comentarios' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "seguimiento-acciones" o el recurso "comentarios".');
  }

  const acciones = ['list', 'read'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de seguimiento-acciones:comentarios creados correctamente.');
}

/**
 * ==========================================
 * 5. GESTIÓN DE EVIDENCIAS
 * ==========================================
 */
async function seedPermisosEvidenciasReportesTrimestrales(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'gestion-evidencias' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'reportes-trimestrales' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "gestion-evidencias" o el recurso "reportes-trimestrales".');
  }

  const acciones = ['list', 'read'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de gestion-evidencias:reportes-trimestrales creados correctamente.');
}

async function seedPermisosEvidenciasEvidencias(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'gestion-evidencias' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'evidencias' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "gestion-evidencias" o el recurso "evidencias".');
  }

  const acciones = ['list', 'read', 'status-update'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de gestion-evidencias:evidencias creados correctamente.');
}

async function seedPermisosEvidenciasComentarios(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'gestion-evidencias' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'comentarios' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "gestion-evidencias" o el recurso "comentarios".');
  }

  const acciones = ['create', 'list', 'read', 'update', 'delete'];
  await registrarPermisos(modulo, recurso, acciones, accionPorNombre);
  console.log('  -> Permisos de gestion-evidencias:comentarios creados correctamente.');
}

/**
 * ==========================================
 * 6. INFORMES
 * ==========================================
 */
async function seedPermisosInformesInformes(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'informes' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'informes' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "informes" o el recurso "informes".');
  }

  const accionesInformes = ['list', 'read', 'update', 'delete', 'download', 'generate'];
  await registrarPermisos(modulo, recurso, accionesInformes, accionPorNombre);
  console.log('  -> Permisos de informes:informes creados correctamente.');
}

/**
 * ==========================================
 * 7. DASHBOARD EJECUTIVO
 * ==========================================
 */


/**
 * ==========================================
 * 8. PANEL ADMINISTRATIVO
 * ==========================================
 */
async function seedPermisosPanelAdminUsuarios(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'panel-admin' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'usuarios' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "panel-admin" o el recurso "usuarios".');
  }

  const accionesUsuarios = ['create', 'list', 'read', 'update', 'delete', 'status-update', 'assign'];
  await registrarPermisos(modulo, recurso, accionesUsuarios, accionPorNombre);
  console.log('  -> Permisos de panel-admin:usuarios creados correctamente.');
}

async function seedPermisosPanelAdminRoles(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'panel-admin' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'roles' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "panel-admin" o el recurso "roles".');
  }

  const accionesRoles = ['create', 'list', 'read', 'update', 'delete', 'status-update'];
  await registrarPermisos(modulo, recurso, accionesRoles, accionPorNombre);
  console.log('  -> Permisos de panel-admin:roles creados correctamente.');
}

async function seedPermisosPanelAdminUnidadesAdministrativas(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'panel-admin' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'unidades-administrativas' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "panel-admin" o el recurso "unidades-administrativas".');
  }

  const accionesUnidades = ['create', 'list', 'read', 'update', 'delete'];
  await registrarPermisos(modulo, recurso, accionesUnidades, accionPorNombre);
  console.log('  -> Permisos de panel-admin:unidades-administrativas creados correctamente.');
}

async function seedPermisosPanelAdminResponsables(accionPorNombre) {
  const modulo = await prisma.modulo.findFirst({ where: { nombre: 'panel-admin' } });
  const recurso = await prisma.recurso.findFirst({ where: { nombre: 'responsables' } });

  if (!modulo || !recurso) {
    throw new Error('No se encontró el módulo "panel-admin" o el recurso "responsables".');
  }

  const accionesResponsables = ['create', 'list', 'read', 'update', 'delete'];
  await registrarPermisos(modulo, recurso, accionesResponsables, accionPorNombre);
  console.log('  -> Permisos de panel-admin:responsables creados correctamente.');
}

/**
 * ==========================================
 * MAIN PRINCIPAL ORDENADO
 * ==========================================
 */
async function main() {
  console.log('🚀 Iniciando seeder jerárquico de permisos...');

  const acciones = await prisma.accion.findMany();
  if (acciones.length === 0) {
    throw new Error('La tabla de acciones está vacía. Ejecuta primero el seed de acciones.');
  }

  const accionPorNombre = Object.fromEntries(acciones.map(a => [a.nombre, a]));

  // 1. Matriz de seguimiento
  await seedPermisosMatrizRiesgos(accionPorNombre);
  await seedPermisosMatrizSeguimientoAccionesControl(accionPorNombre);

  // 2. Mapa de Riesgos
  await seedPermisosMapaRiesgosArchivos(accionPorNombre);

  // 3. PTAR (Módulo: ptar-matriz-riesgos)
  await seedPermisosPtarArchivos(accionPorNombre);

  // 4. Seguimiento de acciones
  await seedPermisosSeguimientoAccionesControl(accionPorNombre);
  await seedPermisosSeguimientoReportesTrimestrales(accionPorNombre);
  await seedPermisosSeguimientoEvidencias(accionPorNombre);
  await seedPermisosSeguimientoComentarios(accionPorNombre);

  // 5. Gestión de evidencias
  await seedPermisosEvidenciasReportesTrimestrales(accionPorNombre);
  await seedPermisosEvidenciasEvidencias(accionPorNombre);
  await seedPermisosEvidenciasComentarios(accionPorNombre);

  // 6. Informes
  await seedPermisosInformesInformes(accionPorNombre);

  // 7. Dashboard Ejecutivo

  // 8. Panel administrativo
  await seedPermisosPanelAdminUsuarios(accionPorNombre);
  await seedPermisosPanelAdminRoles(accionPorNombre);
  await seedPermisosPanelAdminUnidadesAdministrativas(accionPorNombre);
  await seedPermisosPanelAdminResponsables(accionPorNombre);

  console.log('✅ Seeder de Permisos ejecutado y finalizado con éxito.');
}

main()
  .catch(e => { 
    console.error('❌ Error crítico en el seeder de permisos:', e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });