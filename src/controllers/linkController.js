const linkService = require('../services/linkService');

exports.getLinks = (req, res) => {
    linkService.readLinks(req, res);
};

exports.saveLink = (req, res) => {
    linkService.saveLink(req, res);
};