const fs = require('fs');
const path = require('path');

exports.handler = function(event, context) {
    const { link } = JSON.parse(event.body);
    if (!link) {
        return {
            statusCode: 400,
            body: 'Se requiere un link.'
        };
    }

    fs.readFile(path.join(__dirname, '../links.json'), 'utf8', (err, data) => {
        if (err) {
            return {
                statusCode: 500,
                body: 'Error al leer el archivo links.json.'
            };
        }

        let links = [];
        try {
            links = JSON.parse(data);
        } catch (e) {
            // Si no hay contenido en el archivo o error en el parseo
        }

        if (!links.includes(link)) {
            links.push(link);
            fs.writeFile(path.join(__dirname, '../links.json'), JSON.stringify(links, null, 2), (err) => {
                if (err) {
                    return {
                        statusCode: 500,
                        body: 'Error al guardar el link.'
                    };
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Link guardado correctamente.' })
                };
            });
        } else {
            return {
                statusCode: 400,
                body: 'El link ya está guardado.'
            };
        }
    });
};
