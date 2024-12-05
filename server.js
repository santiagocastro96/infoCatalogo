const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en las peticiones

// Ruta para servir el archivo links.json
app.get('/links.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'links.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo links.json:', err);
            return res.status(500).send('Error al leer los links.');
        }

        try {
            const links = JSON.parse(data);
            res.json(links);  // Enviar los links como respuesta
        } catch (e) {
            console.error('Error al parsear JSON:', e);
            return res.status(500).send('Error al procesar los datos de links.');
        }
    });
});

// Ruta para guardar un nuevo link en links.json
app.post('/save-links', (req, res) => {
    const newLink = req.body.link;  // Se espera que el body tenga un campo 'link'

    // Leer los links actuales del archivo
    fs.readFile(path.join(__dirname, 'links.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo links.json:', err);
            return res.status(500).send('Error al guardar los links.');
        }

        let links = [];
        try {
            links = JSON.parse(data);  // Parsear el archivo de links
        } catch (e) {
            console.error('Error al parsear JSON:', e);
        }

        // Asegurarse de que el nuevo link no esté duplicado
        if (newLink && !links.includes(newLink)) {
            links.push(newLink);  // Agregar el nuevo link al arreglo

            // Guardar el nuevo arreglo de links en el archivo
            fs.writeFile(path.join(__dirname, 'links.json'), JSON.stringify(links, null, 2), (err) => {
                if (err) {
                    console.error('Error al guardar los links:', err);
                    return res.status(500).send('Error al guardar los links.');
                }
                res.send({ message: 'Link guardado correctamente.' });
            });
        } else {
            res.send({ message: 'Este link ya está guardado o el link está vacío.' });
        }
    });
});

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para realizar el scraping
app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Se requiere una URL.');
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Extraer el título del producto, nombre del vendedor y el precio
        const content = await page.evaluate(() => {
            const titleDiv = document.querySelector('.ui-pdp-header__title-container');
            const title = titleDiv ? titleDiv.textContent.trim() : 'Título no encontrado.';
            
            const sellerHeaderDiv = document.querySelector('.ui-pdp-seller__header');
            const sellerName = sellerHeaderDiv ? sellerHeaderDiv.textContent.trim() : 'Vendedor no encontrado.';
            
            const priceDiv = document.querySelector('.ui-pdp-price__second-line');
            const priceText = priceDiv ? priceDiv.textContent.trim() : 'Precio no encontrado.';
            
            return {
                title,
                sellerName,
                priceText
            };
        });

        await browser.close();
        res.json(content);
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
