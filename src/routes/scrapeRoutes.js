const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

router.get('/scrape', scrapeController.scrapeProduct);

module.exports = router;