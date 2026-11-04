const comentariosService = require('../services/comentarios.service');

// 1. Crear comentario
exports.createComentario = async (req, res) => {
  try {
    if (!req.user || !req.user.id_usuario) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }

    const idUsuario = req.user.id_usuario;

    const comentario = await comentariosService.createComentario(
      req.body,
      idUsuario
    );

    return res.status(201).json({
      message: 'Comentario creado correctamente',
      comentario
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

// 2. Listar comentarios
exports.listComentarios = async (req, res) => {
  try {
    const comentarios = await comentariosService.listComentarios();

    return res.status(200).json({
      total: comentarios.length,
      comentarios
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

// 3. Consultar comentario por ID
exports.getComentarioById = async (req, res) => {
  try {
    const comentario = await comentariosService.getComentarioById(
      req.params.id
    );

    if (!comentario) {
      return res.status(404).json({
        message: 'Comentario no encontrado'
      });
    }

    return res.status(200).json(comentario);

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// 4. Actualizar comentario
exports.updateComentario = async (req, res) => {
  try {
    const comentario = await comentariosService.updateComentario(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      message: 'Comentario actualizado correctamente',
      comentario
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

// 5. Eliminar comentario
exports.deleteComentario = async (req, res) => {
  try {
    await comentariosService.deleteComentario(req.params.id);

    return res.status(200).json({
      message: 'Comentario eliminado correctamente'
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