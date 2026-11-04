const riesgoService = require('../services/riesgo.service');
const { PrismaClient } = require('@prisma/client');

// Instancia local de Prisma para la ejecución de consultas nativas SQL
const prismaLocal = new PrismaClient();

// Crear
exports.createRiesgo = async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion) {
      return res.status(400).json({ error: 'La descripción del riesgo es obligatoria' });
    }
    const riesgo = await riesgoService.createRiesgo(req.body);
    res.status(201).json(riesgo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar
exports.listRiesgos = async (req, res) => {
  try {
    const riesgos = await riesgoService.listRiesgos();
    res.json(riesgos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consultar por ID
exports.getRiesgoById = async (req, res) => {
  try {
    const riesgo = await riesgoService.getRiesgoById(Number(req.params.id));
    if (!riesgo) return res.status(404).json({ message: 'Riesgo no encontrado' });
    res.json(riesgo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar
exports.updateRiesgo = async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion) {
      return res.status(400).json({ error: 'La descripción del riesgo es obligatoria' });
    }
    const riesgo = await riesgoService.updateRiesgo(Number(req.params.id), req.body);
    res.json(riesgo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar
exports.deleteRiesgo = async (req, res) => {
  try {
    await riesgoService.deleteRiesgo(Number(req.params.id));
    res.json({ message: 'Riesgo eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Endpoint solicitado por Iván para mostrar la tablita de acciones de control
exports.getAccionesControl = async (req, res) => {
  try {
    const query = `
      SELECT 
        CONCAT(r.anio, '_', r.numero) AS riesgo, 
        ac.numero AS no_accion, 
        ac.descripcion AS descripcion, 
        ac.medios_verificacion, 
        ua.nombre AS unidad, 
        resp.nombre AS responsable, 
        CONCAT(DATE_FORMAT(ac.fecha_inicio, '%d/%m/%Y'), ' - ', DATE_FORMAT(ac.fecha_termino, '%d/%m/%Y')) AS fechas, 
        COALESCE(rt1.porcentaje_avance_trimestral, 0) AS avance_t1, 
        COALESCE(rt2.porcentaje_avance_trimestral, 0) AS avance_t2, 
        COALESCE(rt3.porcentaje_avance_trimestral, 0) AS avance_t3, 
        COALESCE(rt4.porcentaje_avance_trimestral, 0) AS avance_t4, 
        COALESCE(
          CONCAT_WS(' | ', 
            IF(rt1.observaciones IS NOT NULL, CONCAT('T1: ', rt1.observaciones), NULL), 
            IF(rt2.observaciones IS NOT NULL, CONCAT('T2: ', rt2.observaciones), NULL), 
            IF(rt3.observaciones IS NOT NULL, CONCAT('T3: ', rt3.observaciones), NULL), 
            IF(rt4.observaciones IS NOT NULL, CONCAT('T4: ', rt4.observaciones), NULL)
          ), ''
        ) AS observaciones, 
        ac.cumplida 
      FROM acciones_control ac 
      INNER JOIN riesgos r ON ac.id_riesgo = r.id_riesgo 
      INNER JOIN unidades_administrativas ua ON ac.id_unidad_administrativa = ua.id_unidad_administrativa 
      INNER JOIN responsables resp ON ac.id_responsable = resp.id_responsable 
      LEFT JOIN reportes_trimestrales rt1 ON ac.id_accion = rt1.id_accion AND rt1.trimestre = 1 
      LEFT JOIN reportes_trimestrales rt2 ON ac.id_accion = rt2.id_accion AND rt2.trimestre = 2 
      LEFT JOIN reportes_trimestrales rt3 ON ac.id_accion = rt3.id_accion AND rt3.trimestre = 3 
      LEFT JOIN reportes_trimestrales rt4 ON ac.id_accion = rt4.id_accion AND rt4.trimestre = 4;
    `;

    // Se eliminó la diagonal invertida para ejecutar correctamente la consulta cruda
    const result = await prismaLocal.$queryRawUnsafe(query);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la matriz de acciones de control',
      error: error.message
    });
  }
};

// Lógica adicional del mapa de riesgos para manejar la subida del archivo usando la utilería
exports.uploadMapaRiesgoArchivo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, selecciona un archivo válido (PNG, PDF, JPEG).'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Archivo del mapa de riesgos subido exitosamente',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la subida del archivo',
      error: error.message
    });
  }
};
