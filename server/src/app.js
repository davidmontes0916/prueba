const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const riesgoRoutes = require('./routes/riesgo.routes');
const responsableRoutes = require('./routes/responsable.routes');
const informeRoutes = require('./routes/informe.routes');
const mapaRiesgoRoutes = require('./routes/mapaRiesgos.routes');
const catalogoRoutes = require('./routes/catalogo.routes'); 
const archivoRoutes = require('./routes/archivo.routes')
const accionesControlRoutes =require('./routes/accionesControl.routes');
const reportesTrimestralesRoutes = require('./routes/reportesTrimestrales.routes');
const evidenciasRoutes = require('./routes/evidencias.routes');
const commentariosRoutes = require('./routes/comentarios.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', riesgoRoutes);
app.use('/api', responsableRoutes);
app.use('/api', informeRoutes);
app.use('/api', mapaRiesgoRoutes);
app.use('/api', catalogoRoutes);
app.use('/api', archivoRoutes);
app.use('/api', accionesControlRoutes);
app.use('/api', reportesTrimestralesRoutes);
app.use('/api', evidenciasRoutes);
app.use('/api', commentariosRoutes);

const path = require('path');
app.use('/public/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = app;
