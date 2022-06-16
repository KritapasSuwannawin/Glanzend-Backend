const express = require('express');

const accountController = require('../controllers/accountController');

const router = express.Router();

router.route('/register').post(accountController.registerAccount);
router.route('/login').post(accountController.loginAccount);

module.exports = router;
