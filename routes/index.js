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
    .put(validateToken, ProjectCtrl.update)

// Fund Request Module
const FundManegementController = require('../controllers/fund-management');
const FundManagementCtrl = new FundManegementController();

router.post('/fund-management/request', validateToken, FundManagementCtrl.request);
router.put('/fund-management/approve/:id', validateToken, FundManagementCtrl.approve);
router.put('/fund-management/reject/:id', validateToken, FundManagementCtrl.reject);
router.get('/fund-management/disbursed', validateToken, FundManagementCtrl.disbursements);

router.route('/fund-management')
    .get(validateToken, FundManagementCtrl.all)
    .put(validateToken, FundManagementCtrl.update)


module.exports = router;