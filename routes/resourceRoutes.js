const express = require('express');

const resourceController = require('../controllers/resourceController');

const router = express.Router();

router.route('/startup').get(resourceController.getStartupResource);

module.exports = router;
