const reportesService =
  require('../services/reportesTrimestrales.service');

// 3. Crear reporte trimestral
exports.createReporteTrimestral = async (req, res) => {
  try {
    const { id_accion, trimestre } = req.body;

    if (
      id_accion === undefined ||
      trimestre === undefined ||
      !Number.isInteger(Number(id_accion)) ||
      Number(id_accion) <= 0 ||
      !Number.isInteger(Number(trimestre)) ||
      ![1, 2, 3, 4].includes(Number(trimestre))
    ) {
      return res.status(400).json({
        error: 'Se requiere un id_accion válido y un trimestre del 1 al 4'
      });
    }

    const reporte =
      await reportesService.createReporteTrimestral(req.body);

    res.status(201).json(reporte);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Listar reportes trimestrales
exports.listReportesTrimestrales = async (req, res) => {
  try {
    const reportes =
      await reportesService.listReportesTrimestrales();

    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Consultar reporte por ID
exports.getReporteTrimestralById = async (req, res) => {
  try {
    const reporte =
      await reportesService.getReporteTrimestralById(
        req.params.id
      );

    if (!reporte) {
      return res.status(404).json({
        message: 'Reporte trimestral no encontrado'
      });
    }

    res.json(reporte);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Actualizar reporte por ID
exports.updateReporteTrimestral = async (req, res) => {
  try {
    const reporte =
      await reportesService.updateReporteTrimestral(
        req.params.id,
        req.body
      );

    res.json(reporte);
  } catch (error) {
    const status = error.message.includes('no encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};

// 7. Eliminar reporte por ID
exports.deleteReporteTrimestral = async (req, res) => {
  try {
    await reportesService.deleteReporteTrimestral(req.params.id);

    res.json({
      message: 'Reporte trimestral eliminado correctamente'
    });
  } catch (error) {
    const status = error.message.includes('no encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};