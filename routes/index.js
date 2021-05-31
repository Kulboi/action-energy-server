'use strict'

const router = require('express').Router();

// Middlewares
const validateToken = require('./../middlewares/validateToken');
const calculateProvisionalProfit = require('./../middlewares/calculateProvisionalProfit');

router.get('', (req, res) => {
  res.status(200).json({
    message: 'Welcome to action energy accounts backend service'
  });
});

// Auth Module
const AuthController = require('./../controllers/auth');
const AuthCtrl = new AuthController();

router.post('/register', AuthCtrl.register);
router.post('/login', AuthCtrl.login);
router.put('/change-password/:id', validateToken, AuthCtrl.changePassword);

// User Module
const UserController = require('./../controllers/user');
const UserCtrl = new UserController();

router.post('/users', validateToken, UserCtrl.addUser)
router.get('/users', validateToken, UserCtrl.getUsers)
router.get('/users/:id', validateToken, UserCtrl.profile)
router.put('/users/:id', validateToken, UserCtrl.update)

// Customer Module
const CustomerController = require('./../controllers/customers');
const CustomerCtrl = new CustomerController();

router.route('/customers')
  .post(validateToken, CustomerCtrl.add)
  .get(validateToken, CustomerCtrl.getCustomers)
  .put(validateToken, CustomerCtrl.update)
  .delete(validateToken, CustomerCtrl.disable);

router.route('/customers/activate')
  .put(validateToken, CustomerCtrl.reactivate)
router.route('/customers/search')
  .get(validateToken, CustomerCtrl.search)

// Project Module
const ProjectController = require('./../controllers/projects');
const ProjectCtrl = new ProjectController();

router.route('/projects')
  .post(validateToken, ProjectCtrl.add)
  .get(validateToken, ProjectCtrl.all)
  .put(validateToken, ProjectCtrl.update);

router.route('/projects/search')
  .get(validateToken, ProjectCtrl.search)
router.route('/projects/statistics')
  .get(validateToken, ProjectCtrl.statistics)

// Fund Disbursements Module
const DisbursementController = require('./../controllers/disbursements');
const DisbursementCtrl = new DisbursementController();

router.route('/disbursements')
  .post(validateToken, DisbursementCtrl.add)
  .get(validateToken, DisbursementCtrl.all)
  .put(validateToken, DisbursementCtrl.update)
  .delete(validateToken, DisbursementCtrl.remove);

// Payment Requests Module
const PaymentRequestController = require('./../controllers/payment-request');
const PaymentRequestCtrl = new PaymentRequestController();

router.route('/payment-requests')
  .post(validateToken, PaymentRequestCtrl.add)
  .get(validateToken, PaymentRequestCtrl.all)
  .put(validateToken, PaymentRequestCtrl.update)
  .delete(validateToken, PaymentRequestCtrl.remove);

router.get('/payment-requests/search', validateToken, PaymentRequestCtrl.search);

// Site Purchase Requests Module
const SitePurchaseController = require('./../controllers/site-purchase');
const SitePurchaseCtrl = new SitePurchaseController();

router.route('/site-purchase')
  .post(validateToken, SitePurchaseCtrl.add)
  .get(validateToken, SitePurchaseCtrl.all)
  .put(validateToken, SitePurchaseCtrl.update)
  .delete(validateToken, SitePurchaseCtrl.remove);

router.get('/site-purchase/search', validateToken, SitePurchaseCtrl.search);

// Fund Request
const FundRequestController = require('./../controllers/fund-request');
const FundRequestCtrl = new FundRequestController();

router.route('/fund-request')
  .post(validateToken, FundRequestCtrl.add)
  .get(validateToken, FundRequestCtrl.all)
  .put(validateToken, FundRequestCtrl.update)
  .delete(validateToken, FundRequestCtrl.remove);

router.get('/fund-request/search', validateToken, FundRequestCtrl.search);


module.exports = router;