const catalogoService = require('../services/catalogo.service');

exports.getRoles = async (req, res) => {
  try {
    const roles = await catalogoService.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUnidadesAdministrativas = async (req, res) => {
  try {
    const unidades = await catalogoService.getUnidadesAdministrativas();
    res.json(unidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
