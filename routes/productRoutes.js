const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

router.route('/').get(productController.getProduct);
router.route('/:id').get(productController.getProductByID);

module.exports = router;
