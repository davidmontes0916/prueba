// src/utils/fileView.js
const path = require('path');
const fs = require('fs');

/**
 * Utilidad reutilizable para servir y visualizar archivos adjuntos en el navegador o Postman.
 * Maneja automáticamente las cabeceras HTTP de visualización de acuerdo al formato del archivo.
 * 
 * @param {string} fileName - Nombre del archivo guardado en el disco (ej: 1713549281234.pdf)
 * @param {Object} res - Objeto de respuesta Express (res)
 * @returns {void}
 */
const serveFileForPreview = (fileName, res) => {
  if (!fileName) {
    return res.status(400).json({ success: false, message: 'El nombre del archivo es requerido.' });
  }

  // Resolver la ruta física del archivo dentro de la carpeta /uploads al mismo nivel de src
  const filePath = path.join(__dirname, '../../uploads', fileName);

  // Validar si el archivo realmente existe en el disco duro del servidor
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'El archivo físico no fue encontrado en el servidor.' });
  }

  // Obtener la extensión del archivo para mapear el Content-Type correcto de visualización
  const ext = path.extname(fileName).toLowerCase();

  const contentTypeMap = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  const contentType = contentTypeMap[ext] || 'application/octet-stream';

  // Si es un documento Excel (.xlsx), los navegadores no lo previsualizan de forma nativa,
  // por lo que forzamos la cabecera de descarga adjunta. Para PDF e imágenes, usamos "inline".
  if (ext === '.xlsx') {
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  } else {
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
  }

  res.setHeader('Content-Type', contentType);

  // Transmitir el archivo mediante un Stream eficiente de lectura para no saturar la memoria RAM
  const fileStream = fs.createReadStream(filePath);
  
  fileStream.on('error', (error) => {
    return res.status(500).json({ success: false, message: 'Error al leer el flujo del archivo.', error: error.message });
  });

  fileStream.pipe(res);
};

module.exports = {
  serveFileForPreview
};
