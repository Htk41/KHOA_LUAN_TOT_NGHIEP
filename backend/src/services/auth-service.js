const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { ServerConfig } = require('../config'); // Chúng ta sẽ cấu hình cái này ở phần sau

const userRepository = new UserRepository();

async function register(data) {
    try {
        // 1. Kiểm tra email tồn tại
        const existingUser = await userRepository.findByEmail(data.email);
        if(existingUser) {
            throw new AppError('Email already exists', StatusCodes.BAD_REQUEST);
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(+ServerConfig.SALT_ROUNDS); // + để chuyển string thành số
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        // 3. Tạo user
        const user = await userRepository.create({
            ...data,
            password: hashedPassword
        });
        
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Cannot register user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function login(data) {
    try {
        // 1. Tìm user theo email
        const user = await userRepository.findByEmail(data.email);
        if(!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }

        // 2. Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if(!isPasswordValid) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }

        // 3. Tạo Token (JWT)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            ServerConfig.JWT_SECRET, 
            { expiresIn: ServerConfig.JWT_EXPIRY }
        );

        return { token, user }; // Trả về cả token và thông tin user
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Cannot login', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    register,
    login
}