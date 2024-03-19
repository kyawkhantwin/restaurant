const express = require('express');
const { loginShop } = require('../controllers/loginController.js');


const router = express.Router()

router.post('/login',loginShop);


module.exports = router