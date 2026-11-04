const usuarioService = require('../services/usuario.service');

// Crear
exports.createUsuario = async (req, res) => {
  try {
    const user = await usuarioService.createUsuario(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar
exports.listUsuarios = async (req, res) => {
  try {
    const users = await usuarioService.listUsuarios();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consultar
exports.getUsuarioById = async (req, res) => {
  try {
    const user = await usuarioService.getUsuarioById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar
exports.updateUsuario = async (req, res) => {
  try {
    const user = await usuarioService.updateUsuario(Number(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar Estado (Status Update)
exports.updateStatusUsuario = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({ error: 'El campo estado es requerido' });
    }
    const user = await usuarioService.updateStatusUsuario(Number(req.params.id), estado);
    res.json({ message: 'Estatus actualizado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar
exports.deleteUsuario = async (req, res) => {
  try {
    await usuarioService.deleteUsuario(Number(req.params.id));
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Asignar rol a usuario
exports.asignarRol = async (req, res) => {
  try {
    const id_usuario = Number(req.params.id);
    const { id_rol } = req.body;

    if (!id_rol) {
      return res.status(400).json({ error: 'El campo id_rol es requerido' });
    }

    const asignacion = await usuarioService.asignarRolUsuario(id_usuario, Number(id_rol));
    res.json({ 
      message: 'Rol asignado correctamente al usuario', 
      asignacion 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
