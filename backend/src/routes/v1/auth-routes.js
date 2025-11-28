const express = require('express');
const { AuthController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', AuthController.register);

// POST /api/v1/auth/login
router.post('/login', AuthController.login);

// API Đổi mật khẩu
router.put('/change-password', 
    AuthRequestMiddlewares.validateUserAuth, // Bắt buộc phải đăng nhập
    AuthController.changePassword
);

// API Cập nhật hồ sơ
router.put('/profile/edit', 
    AuthRequestMiddlewares.validateUserAuth,
    AuthController.updateProfile
);
module.exports = router;