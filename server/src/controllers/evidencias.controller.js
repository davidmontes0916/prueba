const evidenciasService = require('../services/evidencias.service');
const path = require('path');
const { serveFileForPreview } = require('../utils/fileView');

// 1. Subir evidencia
exports.uploadEvidencia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No se ha adjuntado ningún archivo'
      });
    }

    const idUsuario = req.user.id_usuario;

    let ext = path.extname(req.file.originalname)
      .replace('.', '')
      .toUpperCase();

    if (ext === 'JPG') ext = 'JPEG';

    const formatosPermitidos = ['PDF', 'JPEG', 'XLSX'];

    if (!formatosPermitidos.includes(ext)) {
      return res.status(400).json({
        error: `Formato no permitido. Valores: ${formatosPermitidos.join(', ')}`
      });
    }

    let tipo = (req.body.tipo || 'MAPA_RIESGOS').toUpperCase();

    if (tipo === 'MAP') tipo = 'MAPA_RIESGOS';

    const tiposPermitidos = [
      'MATRIZ_RIESGOS',
      'PTAR',
      'MAPA_RIESGOS'
    ];

    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        error: `Tipo de evidencia no válido. Valores: ${tiposPermitidos.join(', ')}`
      });
    }

    const evidenciaData = {
      nombre: req.body.nombre || req.file.originalname,
      formato: ext,
      tipo,
      ruta: req.file.filename
    };

    const evidencia = await evidenciasService.createEvidencia(
      evidenciaData,
      idUsuario
    );

    return res.status(201).json(evidencia);

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// 2. Listar evidencias
exports.listEvidencias = async (req, res) => {
  try {
    const evidencias = await evidenciasService.listEvidencias();

    return res.json(evidencias);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

// 3. Consultar evidencia por ID
exports.getEvidenciaById = async (req, res) => {
  try {
    const evidencia = await evidenciasService.getEvidenciaById(
      req.params.id
    );

    if (!evidencia) {
      return res.status(404).json({
        message: 'Evidencia no encontrada'
      });
    }

    return res.json(evidencia);

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// 4. Actualizar únicamente el estatus
exports.updateStatusEvidencia = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        error: 'El estatus es obligatorio'
      });
    }

    const evidencia = await evidenciasService.updateStatusEvidencia(
      req.params.id,
      estado
    );

    return res.json({
      message: 'Estatus actualizado correctamente',
      evidencia
    });

  } catch (error) {
    const status = error.message.includes('no encontrada')
      ? 404
      : 400;

    return res.status(status).json({
      error: error.message
    });
  }
};

// 5. Eliminar evidencia por ID
exports.deleteEvidencia = async (req, res) => {
  try {
    const evidenciaExistente =
      await evidenciasService.getEvidenciaById(req.params.id);

    if (!evidenciaExistente) {
      return res.status(404).json({
        message: 'Evidencia no encontrada'
      });
    }

    await evidenciasService.deleteEvidencia(req.params.id);

    return res.json({
      message: 'Evidencia eliminada correctamente'
    });

  } catch (error) {
    const status = error.message.includes('no encontrado')
      ? 404
      : 400;

    return res.status(status).json({
      error: error.message
    });
  }
};

// 6. Visualizar evidencia
exports.previewEvidencia = async (req, res) => {
  try {
    const { filename } = req.params;

    return serveFileForPreview(filename, res);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};