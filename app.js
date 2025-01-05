const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const port = 3000;
const apiRoutes = require('./routes/api');
const endpointRoutes = require('./routes/endpoint');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que la carpeta de vistas esté configurada

app.use(bodyParser.urlencoded({ extended: true })); // Para manejar datos de formularios
app.use(methodOverride('_method')); // Para sobrescribir métodos en formularios
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos
app.use('/api', apiRoutes);
app.use('/api', endpointRoutes);

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});