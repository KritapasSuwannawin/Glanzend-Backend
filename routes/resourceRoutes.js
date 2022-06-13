const express = require('express');

const resourceController = require('../controllers/resourceController');

const router = express.Router();

router.route('/home-startup').get(resourceController.getHomeStartup);
router.route('/product-startup').get(resourceController.getProductStartup);

module.exports = router;
