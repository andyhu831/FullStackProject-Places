const express = require('express');
const { check } = require('express-validator');

const UsersControllers = require('../controllers/users-controller');

const router = express.Router();

router.get('/', UsersControllers.getUsers);

router.post('/signup', check('username').not().isEmpty(), UsersControllers.signup);

router.post('/login', UsersControllers.login);

module.exports = router;