const express = require('express');

const accountController = require('../controllers/accountController');

const router = express.Router();

router.route('/register').post(accountController.registerMember);

module.exports = router;
