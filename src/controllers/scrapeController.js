const scrapeService = require('../services/scrapeService');

exports.scrapeProduct = async (req, res) => {
    await scrapeService.scrapeProductData(req, res);
};