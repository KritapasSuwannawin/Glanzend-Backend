const express = require('express');

const accountController = require('../controllers/accountController');

const router = express.Router();

router.route('/register').post(accountController.registerAccount);
router.route('/login').post(accountController.loginAccount);
router.route('/column').get(accountController.getColumn).put(accountController.updateColumn);
router
  .route('/line-item')
  .post(accountController.createLineItem)
  .get(accountController.getLineItem)
  .put(accountController.updateLineItem)
  .delete(accountController.deleteLineItem);

module.exports = router;
