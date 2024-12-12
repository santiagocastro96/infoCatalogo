const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.get('/links.json', linkController.getLinks);
router.post('/save-links', linkController.saveLink);

module.exports = router;