const mapaRiesgoService = require('../services/mapaRiesgo.service');

async function createMapaRiesgo(req, res) {
  try {
    const { nombre, formato, ruta, id_usuario } = req.body;

    if (!nombre || !formato || !ruta || !id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, formato, ruta, id_usuario' });
    }

    const archivo = await mapaRiesgoService.createMapaRiesgo({
      nombre,
      formato,
      tipo: 'MAPA_RIESGOS',
      ruta,
      id_usuario
    });

    return res.status(201).json(archivo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el mapa de riesgos' });
  }
}

async function deleteMapaRiesgo(req, res) {
  try {
    const { id } = req.params;
    await mapaRiesgoService.deleteMapaRiesgo(Number(id));
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Mapa de riesgos no encontrado' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar el mapa de riesgos' });
  }
}

module.exports = {
  createMapaRiesgo,
  deleteMapaRiesgo
};