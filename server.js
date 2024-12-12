const express = require('express');
const cors = require('cors');
const path = require('path');
const linkRoutes = require('./src/routes/linkRoutes');
const scrapeRoutes = require('./src/routes/scrapeRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(linkRoutes);
app.use(scrapeRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});