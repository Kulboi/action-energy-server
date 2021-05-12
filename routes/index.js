'use strict'

const router = require('express').Router();

// Controllers
const AuthController = require('./../controllers/auth');
const AuthCtrl = new AuthController();

router.get('', (req, res) => {
  res.status(200).json({
    message: 'Welcome to action energy accounts backend service'
  });
});

router.post('/register', (req, res) => {
  AuthCtrl.register(req, res);
});

router.post('/login', (req, res) => {
  AuthCtrl.login(req, res);
});


module.exports = router;