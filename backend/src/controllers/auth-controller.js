const { StatusCodes } = require('http-status-codes');
const { AuthService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

async function register(req, res) {
    try {
        const user = await AuthService.register({
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function login(req, res) {
    try {
        const response = await AuthService.login({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function changePassword(req, res) {
    try {
        // req.user.id có được từ middleware xác thực (AuthRequestMiddlewares)
        const result = await AuthService.changePassword(req.user.id, req.body);
        SuccessResponse.data = result;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateProfile(req, res) {
    try {
        const result = await AuthService.updateProfile(req.user.id, req.body);
        SuccessResponse.data = result;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    register,
    login,
    changePassword,
    updateProfile
}