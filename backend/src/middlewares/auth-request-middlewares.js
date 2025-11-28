const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { ServerConfig } = require('../config');

function validateUserAuth(req, res, next) {
    // 1. Lấy token từ header (thường gửi dạng: "Bearer <token>")
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if(!token) {
        ErrorResponse.message = 'Something went wrong while authenticating';
        ErrorResponse.error = new AppError('Missing JWT token', StatusCodes.FORBIDDEN);
        return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
    }

    try {
        // 2. Xác thực token (kiểm tra chữ ký và hạn sử dụng)
        const response = jwt.verify(token, ServerConfig.JWT_SECRET);
        
        // 3. Lưu thông tin user vào request để các bước sau dùng
        req.user = response; 
        
        next();
    } catch(error) {
        ErrorResponse.message = 'Something went wrong while authenticating';
        ErrorResponse.error = new AppError('Invalid JWT token', StatusCodes.UNAUTHORIZED);
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }
}

function validateIsAdmin(req, res, next) {
    if(req.user && req.user.role === 'admin') {
        next();
    } else {
        ErrorResponse.message = 'Something went wrong while authenticating';
        ErrorResponse.error = new AppError('Unauthorized access', StatusCodes.UNAUTHORIZED);
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }
}

module.exports = {
    validateUserAuth,
    validateIsAdmin
}