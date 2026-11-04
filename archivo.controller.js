// src/controllers/archivo.controller.js
const archivoService = require('../services/archivo.service');

// Determinar formato basado en mimetype o extensión
const determinarFormato = (mimetype, filename) => {
  const mime = mimetype.toLowerCase();
  if (mime.includes('pdf')) return 'PDF';
  if (mime.includes('excel') || mime.includes('spreadsheetml') || filename.endsWith('.xlsx')) return 'XLSX';
  return 'JPEG';
};

const uploadArchivo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha adjuntado ningún archivo.'
      });
    }

    const tipoArchivo = req.body.tipo || 'MAPA_RIESGOS';
    const idUsuario = req.user ? req.user.id_usuario : 1;
    const formato = determinarFormato(req.file.mimetype, req.file.originalname);

    const nuevoArchivo = await archivoService.createArchivo({
      nombre: req.file.originalname,
      formato: formato,
      tipo: tipoArchivo,
      ruta: req.file.path,
      id_usuario: Number(idUsuario)
    });

    return res.status(201).json({
      success: true,
      message: 'Archivo subido y registrado exitosamente en la base de datos',
      data: nuevoArchivo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la subida del archivo',
      error: error.message
    });
  }
};

module.exports = {
  uploadArchivo
};