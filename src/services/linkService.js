const fs = require('fs');
const path = require('path');

exports.readLinks = (req, res) => {
    fs.readFile(path.join(__dirname, '../../data/links.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los links.');
        try {
            const links = JSON.parse(data);
            res.json(links);
        } catch (e) {
            res.status(500).send('Error al procesar los datos de links.');
        }
    });
};

exports.saveLink = (req, res) => {
    const newLink = req.body.link;
    const linksPath = path.join(__dirname, '../../data/links.json');

    fs.readFile(linksPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los links.');

        let links = [];
        try {
            links = JSON.parse(data);
        } catch (e) {
            console.error('Error al parsear JSON:', e);
        }

        if (newLink && !links.includes(newLink)) {
            links.push(newLink);
            fs.writeFile(linksPath, JSON.stringify(links, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar los links.');
                res.send({ message: 'Link guardado correctamente.' });
            });
        } else {
            res.send({ message: 'Este link ya está guardado o el link está vacío.' });
        }
    });
};