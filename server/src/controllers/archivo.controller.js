const archivoService = require('../services/archivo.service');
const path = require('path');

// Upload - Sube el archivo físico y registra en la BD
exports.uploadArchivo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha adjuntado ningún archivo' });
    }

    // El objeto req.user contiene los datos del usuario inyectados por authenticateToken
    const idUsuario = req.user.id_usuario; 
    
    // Extraemos la extensión del archivo y la limpiamos
    let ext = path.extname(req.file.originalname).replace('.', '').toUpperCase();
    
    // Normalizamos la extensión para que coincida exactamente con tu ENUM FormatoArchivo de MySQL
    if (ext === 'JPG') ext = 'JPEG';

    // 1. Validación estricta del ENUM FormatoArchivo
    const formatosPermitidos = ['PDF', 'JPEG', 'XLSX'];
    if (!formatosPermitidos.includes(ext)) {
      return res.status(400).json({ 
        error: `El formato ${ext} no está permitido en la base de datos. Solo se acepta: ${formatosPermitidos.join(', ')}` 
      });
    }

    // 2. Validación estricta del ENUM TipoArchivo
    // Tomamos el tipo que viene del cliente en mayúsculas, o asignamos MAPA_RIESGOS por defecto
    let tipoArchivoInput = (req.body.tipo || 'MAPA_RIESGOS').toUpperCase();
    
    // Corrección rápida por si escriben "MAP" en lugar del nombre completo del ENUM
    if (tipoArchivoInput === 'MAP') tipoArchivoInput = 'MAPA_RIESGOS';

    const tiposPermitidos = ['MATRIZ_RIESGOS', 'PTAR', 'MAPA_RIESGOS'];
    if (!tiposPermitidos.includes(tipoArchivoInput)) {
      return res.status(400).json({
        error: `El tipo de archivo '${tipoArchivoInput}' no es válido. Valores permitidos: ${tiposPermitidos.join(', ')}`
      });
    }

    // Estructuramos la información limpia para guardarla a través del servicio
    const fileData = {
      nombre: req.body.nombre || req.file.originalname,
      formato: ext,              // Garantiza 'PDF', 'JPEG' o 'XLSX'
      tipo: tipoArchivoInput,    // Garantiza 'MATRIZ_RIESGOS', 'PTAR' o 'MAPA_RIESGOS'
      ruta: req.file.filename    // Nombre único generado por Multer en /uploads
    };

    const nuevoArchivo = await archivoService.createArchivo(fileData, idUsuario);
    return res.status(201).json({ success: true, data: nuevoArchivo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Listar todos los registros
exports.listArchivos = async (req, res) => {
  try {
    const archivos = await archivoService.listArchivos();
    return res.json({ success: true, data: archivos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Consultar detalle por ID
exports.getArchivoById = async (req, res) => {
  try {
    const archivo = await archivoService.getArchivoById(req.params.id);
    if (!archivo) return res.status(404).json({ message: 'Archivo no encontrado en el sistema' });
    return res.json({ success: true, data: archivo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.deleteArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificamos primero si el archivo existe en la BD
    const archivoExistente = await archivoService.getArchivoById(id);
    if (!archivoExistente) {
      return res.status(404).json({ success: false, message: 'Archivo no encontrado en el sistema' });
    }

    await archivoService.deleteArchivo(id);
    
    return res.json({ 
      success: true, 
      message: 'Archivo eliminado correctamente del sistema y registro borrado' 
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Importamos la nueva utilidad al inicio de tu archivo
const { serveFileForPreview } = require('../utils/fileView');

// Endpoint para renderizar/visualizar archivos de forma dinámica por parámetro
exports.previewArchivo = async (req, res) => {
  try {
    const { filename } = req.params;
    // La utilidad se encarga de validar la existencia, inyectar los Content-Type y hacer el pipe del stream
    return serveFileForPreview(filename, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
