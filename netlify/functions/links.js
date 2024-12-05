const fs = require('fs');
const path = require('path');

exports.handler = function(event, context) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../links.json'), 'utf8', (err, data) => {
            if (err) {
                reject({
                    statusCode: 500,
                    body: 'Error al leer el archivo links.json.'
                });
            } else {
                resolve({
                    statusCode: 200,
                    body: data
                });
            }
        });
    });
};
