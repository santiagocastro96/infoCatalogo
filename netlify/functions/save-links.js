// netlify/functions/save-links.js
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const { link } = JSON.parse(event.body);  // Parsear el body JSON

    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '..', 'links.json'), 'utf8', (err, data) => {
            if (err) {
                reject({ statusCode: 500, body: 'Error al leer el archivo links.json' });
            }

            let links = [];
            try {
                links = JSON.parse(data);
            } catch (e) {
                console.error('Error al parsear JSON:', e);
            }

            if (link && !links.includes(link)) {
                links.push(link);

                fs.writeFile(path.join(__dirname, '..', 'links.json'), JSON.stringify(links, null, 2), (err) => {
                    if (err) {
                        reject({ statusCode: 500, body: 'Error al guardar los links.' });
                    }
                    resolve({ statusCode: 200, body: JSON.stringify({ message: 'Link guardado correctamente.' }) });
                });
            } else {
                resolve({ statusCode: 200, body: JSON.stringify({ message: 'Este link ya está guardado o el link está vacío.' }) });
            }
        });
    });
};
