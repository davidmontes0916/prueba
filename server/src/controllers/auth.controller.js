const { registerUser, loginUser } = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Usuario creado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const { token, user, modules } = await loginUser(correo, contrasena); // 1. Extraes modules
    res.json({ token, user, modules }); // 2. Lo incluyes en la respuesta
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};