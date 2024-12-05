// netlify/functions/links.js
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '..', 'links.json'), 'utf8', (err, data) => {
            if (err) {
                reject({ statusCode: 500, body: 'Error al leer el archivo links.json' });
            }

            try {
                const links = JSON.parse(data);
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(links)
                });
            } catch (e) {
                reject({ statusCode: 500, body: 'Error al procesar los datos de links.' });
            }
        });
    });
};
