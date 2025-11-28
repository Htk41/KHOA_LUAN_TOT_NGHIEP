const express = require('express');
const { AuthController } = require('../../controllers');

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', AuthController.register);

// POST /api/v1/auth/login
router.post('/login', AuthController.login);

module.exports = router;