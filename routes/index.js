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

// User Module
const UserController = require('./../controllers/user');
const UserCtrl = new UserController();

router.get('/users/:id', validateToken, UserCtrl.profile)
router.put('/users/:id', validateToken, UserCtrl.update)

// Customer Module
const CustomerController = require('./../controllers/customers');
const CustomerCtrl = new CustomerController();

router.route('/customers')
    .post(validateToken, CustomerCtrl.add)
    .get(validateToken, CustomerCtrl.all)
    .put(validateToken, CustomerCtrl.update)
    .delete(validateToken, CustomerCtrl.disable);

router.route('/customers/activate')
    .put(validateToken, CustomerCtrl.reactivate)

// Project Module
const ProjectController = require('./../controllers/projects');
const ProjectCtrl = new ProjectController();

router.route('/projects')
    .post(validateToken, calculateProvisionalProfit, ProjectCtrl.add)
    .get(validateToken, ProjectCtrl.all)
    .put(validateToken, ProjectCtrl.update)
    .delete(validateToken, ProjectCtrl.disable);

router.route('/projects/fund')
    .put(validateToken, ProjectCtrl.fundProject)


module.exports = router;