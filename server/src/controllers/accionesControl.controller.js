const accionesControlService = require('../services/accionesControl.service');

// Crear acción de control
exports.createAccionControl = async (req, res) => {
  try {
    const {
      id_riesgo,
      descripcion,
      id_unidad_administrativa,
      id_responsable,
      fecha_inicio,
      fecha_termino
    } = req.body;

    if (
      !id_riesgo ||
      !descripcion ||
      !id_unidad_administrativa ||
      !id_responsable ||
      !fecha_inicio ||
      !fecha_termino
    ) {
      return res.status(400).json({
        error: 'Los datos de la acción de control son obligatorios'
      });
    }

    const accion =
      await accionesControlService.createAccionControl(req.body);

    res.status(201).json(accion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 1. Listar acciones de control
exports.listAccionesControl = async (req, res) => {
  try {
    const acciones =
      await accionesControlService.listAccionesControl();

    res.json(acciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar acciones de control por unidad administrativa
exports.listAccionesControlPorUnidad = async (req, res) => {
  const idUnidadAdministrativa = Number(req.params.id_unidad_administrativa);
  if (!Number.isInteger(idUnidadAdministrativa) || idUnidadAdministrativa <= 0) {
    return res.status(400).json({
      error: 'El ID de la unidad administrativa debe ser un entero positivo'
    });
  }

  try {
    const acciones =
      await accionesControlService.listAccionesControlPorUnidad(
        idUnidadAdministrativa
      );

    res.json(acciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Consultar acción de control por ID
exports.getAccionControlById = async (req, res) => {
  try {
    const accion =
      await accionesControlService.getAccionControlById(
        req.params.id
      );

    if (!accion) {
      return res.status(404).json({
        message: 'Acción de control no encontrada'
      });
    }

    res.json(accion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar acción de control
exports.updateAccionControl = async (req, res) => {
  try {
    const {
      id_riesgo,
      descripcion,
      id_unidad_administrativa,
      id_responsable,
      fecha_inicio,
      fecha_termino
    } = req.body;

    if (
      !id_riesgo ||
      !descripcion ||
      !id_unidad_administrativa ||
      !id_responsable ||
      !fecha_inicio ||
      !fecha_termino
    ) {
      return res.status(400).json({
        error: 'Los datos de la acción de control son obligatorios'
      });
    }

    const accion =
      await accionesControlService.updateAccionControl(
        req.params.id,
        req.body
      );

    res.json(accion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar acción de control
exports.deleteAccionControl = async (req, res) => {
  try {
    await accionesControlService.deleteAccionControl(req.params.id);

    res.json({
      message: 'Acción de control eliminada correctamente'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};