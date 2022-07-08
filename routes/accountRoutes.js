const express = require('express');

const accountController = require('../controllers/accountController');

const router = express.Router();

router.route('/').get(accountController.getAccount).put(accountController.updateAccount);
router.route('/register').post(accountController.registerAccount);
router.route('/login').post(accountController.loginAccount);
router.route('/column').get(accountController.getColumn).put(accountController.updateColumn);
router.route('/sale-order').get(accountController.getSaleOrder).post(accountController.createSaleOrder);
router
  .route('/line-item')
  .get(accountController.getLineItem)
  .post(accountController.createLineItem)
  .put(accountController.updateLineItem)
  .delete(accountController.deleteLineItem);

module.exports = router;
