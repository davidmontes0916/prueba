const { prisma } = require('../config/prisma');

                        // Crear acción de control: el backend calcula el número secuencial por riesgo
                        async function createAccionControl(data) {
                          const idRiesgo = Number(data.id_riesgo);
                          const ultimaAccion = await prisma.accionControl.findFirst({
                            where: { id_riesgo: idRiesgo },
                            orderBy: { numero: 'desc' }
                          });

                          return prisma.accionControl.create({
                            data: {
                              id_riesgo: idRiesgo,
                              numero: ultimaAccion ? ultimaAccion.numero + 1 : 1,
                              descripcion: data.descripcion,
                              medios_verificacion: data.medios_verificacion || null,
                              id_unidad_administrativa: Number(data.id_unidad_administrativa),
                              id_responsable: Number(data.id_responsable),
                              fecha_inicio: new Date(data.fecha_inicio),
                              fecha_termino: new Date(data.fecha_termino),
                              porcentaje_acumulado: data.porcentaje_acumulado === undefined
                                ? 0
                                : Number(data.porcentaje_acumulado),
                              cumplida: data.cumplida === undefined
                                ? false
                                : data.cumplida === true || data.cumplida === 'true'
                            }
                          });
                        }

                        // Listar acciones de control con sus avances y observaciones trimestrales
                        async function obtenerAccionesControl(where) {
                          const acciones = await prisma.accionControl.findMany({
                            where,
                            include: {
                              riesgo: {
                                select: { anio: true, numero: true }
                              },
                              unidad_administrativa: {
                                select: { nombre: true }
                              },
                              responsable: {
                                select: { nombre: true }
                              },
                              reportes_trimestrales: {
                                select: {
                                  trimestre: true,
                                  porcentaje_avance_trimestral: true,
                                  observaciones: true
                                },
                                orderBy: { trimestre: 'asc' }
                              }
                            },
                            orderBy: [
                              { riesgo: { anio: 'desc' } },
                              { riesgo: { numero: 'asc' } },
                              { numero: 'asc' }
                            ]
                          });

                          return acciones.map(accion => {
                            const reportePorTrimestre = trimestre =>
                              accion.reportes_trimestrales.find(reporte => reporte.trimestre === trimestre);
                            const formatearFecha = fecha => {
                              const [anio, mes, dia] = fecha.toISOString().slice(0, 10).split('-');
                              return `${dia}/${mes}/${anio}`;
                            };
                            const observaciones = [1, 2, 3, 4]
                              .map(trimestre => {
                                const reporte = reportePorTrimestre(trimestre);
                                return reporte && reporte.observaciones
                                  ? `T${trimestre}: ${reporte.observaciones}`
                                  : null;
                              })
                              .filter(Boolean)
                              .join(' | ');

                            return {
                              id_accion: accion.id_accion,
                              riesgo: `${accion.riesgo.anio}_${accion.riesgo.numero}`,
                              no_accion: accion.numero,
                              descripcion: accion.descripcion,
                              medios_verificacion: accion.medios_verificacion,
                              unidad: accion.unidad_administrativa.nombre,
                              responsable: accion.responsable.nombre,
                              fechas: `${formatearFecha(accion.fecha_inicio)} - ${formatearFecha(accion.fecha_termino)}`,
                              avance_t1: reportePorTrimestre(1)?.porcentaje_avance_trimestral ?? 0,
                              avance_t2: reportePorTrimestre(2)?.porcentaje_avance_trimestral ?? 0,
                              avance_t3: reportePorTrimestre(3)?.porcentaje_avance_trimestral ?? 0,
                              avance_t4: reportePorTrimestre(4)?.porcentaje_avance_trimestral ?? 0,
                              observaciones,
                              cumplida: accion.cumplida
                            };
                          });
                        }

                        async function listAccionesControl() {
                          return obtenerAccionesControl();
                        }

                        async function listAccionesControlPorUnidad(idUnidadAdministrativa) {
                          return obtenerAccionesControl({
                            id_unidad_administrativa: Number(idUnidadAdministrativa)
                          });
                        }

                        // Consultar acción de control por ID
                        async function getAccionControlById(id_accion) {
                          return prisma.accionControl.findUnique({
                            where: { id_accion: Number(id_accion) }
                          });
                        }

                        // Actualizar acción de control
                        async function updateAccionControl(id_accion, data) {
                          const idAccion = Number(id_accion);
                          const idRiesgo = Number(data.id_riesgo);
                          const accionActual = await prisma.accionControl.findUnique({
                            where: { id_accion: idAccion }
                          });

                          if (!accionActual) throw new Error('Acción de control no encontrada');

                          let numero = accionActual.numero;
                          if (idRiesgo !== accionActual.id_riesgo) {
                            const ultimaAccion = await prisma.accionControl.findFirst({
                              where: { id_riesgo: idRiesgo },
                              orderBy: { numero: 'desc' }
                            });
                            numero = ultimaAccion ? ultimaAccion.numero + 1 : 1;
                          }

                          return prisma.accionControl.update({
                            where: { id_accion: idAccion },
                            data: {
                              id_riesgo: idRiesgo,
                              numero,
                              descripcion: data.descripcion,
                              medios_verificacion: data.medios_verificacion === undefined
                                ? accionActual.medios_verificacion
                                : data.medios_verificacion || null,
                              id_unidad_administrativa: Number(data.id_unidad_administrativa),
                              id_responsable: Number(data.id_responsable),
                              fecha_inicio: new Date(data.fecha_inicio),
                              fecha_termino: new Date(data.fecha_termino),
                              porcentaje_acumulado: data.porcentaje_acumulado === undefined
                                ? accionActual.porcentaje_acumulado
                                : Number(data.porcentaje_acumulado),
                              cumplida: data.cumplida === undefined
                                ? accionActual.cumplida
                                : data.cumplida === true || data.cumplida === 'true'
                            }
                          });
                        }

                        // Eliminar acción de control
                        async function deleteAccionControl(id_accion) {
                          return prisma.accionControl.delete({
                            where: { id_accion: Number(id_accion) }
                          });
                        }

                        module.exports = {
                          createAccionControl,
                          listAccionesControl,
                          listAccionesControlPorUnidad,
                          getAccionControlById,
                          updateAccionControl,
                          deleteAccionControl
                        };