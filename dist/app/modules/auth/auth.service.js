"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const sendMail_1 = require("../../utils/sendMail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isUserExist = yield user_model_1.User.findOne({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isDeleted = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted;
    if (isDeleted === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is deleted');
    }
    const userStatus = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    //check the provided password is exist:
    const isPasswordMatch = yield user_model_1.User.isPasswordMatch(payload === null || payload === void 0 ? void 0 : payload.password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid credentials');
    }
    // generate access token:
    const jwtPayload = {
        userId: (_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id) === null || _a === void 0 ? void 0 : _a.toString(),
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role,
    };
    //generate access token:
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_secret, config_1.default.jwt_expiration);
    //generate refresh token:
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiration);
    //then finally login  user:
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: !!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.passwordChangeAt),
    };
});
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
    });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User already exists');
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'you are not authorized');
    }
    //verified token with decode:
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    //verification of role and authorization:
    const { email, iat } = decoded;
    const isUserExist = yield user_model_1.User.findOne({
        email: email,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    const isDeleted = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted;
    if (isDeleted === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user is deleted');
    }
    const userStatus = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user is blocked');
    }
    //check password change time and token issue time:
    const checkTime = yield user_model_1.User.isJwtIssuedBeforePasswordChange(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.passwordChangeAt, iat);
    if (checkTime) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Token has expired or is invalid');
    }
    //create jwt payload:
    const jwtPayload = {
        userId: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id,
        role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_secret, config_1.default.jwt_refresh_expiration);
    return {
        accessToken,
    };
});
const changePassword = (payload, userPass) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isDeleted = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted;
    if (isDeleted === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is deleted');
    }
    const userStatus = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    //check the provided password is exist:
    const isPasswordMatch = yield user_model_1.User.isPasswordMatch(userPass === null || userPass === void 0 ? void 0 : userPass.oldPassword, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid credentials');
    }
    //encrypted new password:
    const newHasPassword = yield bcrypt_1.default.hash(userPass === null || userPass === void 0 ? void 0 : userPass.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield user_model_1.User.findOneAndUpdate({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
    }, {
        password: newHasPassword,
        passwordChangeAt: new Date(),
    });
    return null;
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    const isDeleted = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted;
    if (isDeleted === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user is deleted');
    }
    const userStatus = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user is blocked');
    }
    //generate access token:
    const jwtPayload = {
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role,
    };
    //generate access token:
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_secret, config_1.default.jwt_expiration);
    const resetLink = `${config_1.default.reset_pass_ui_link}?email=${email}&token=${resetToken}`;
    yield (0, sendMail_1.sendMail)(isUserExist.email, resetLink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    const isDeleted = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted;
    if (isDeleted === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user is deleted');
    }
    const userStatus = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user is blocked');
    }
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'you are not authorized');
    }
    //verified token with decode:
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_secret);
    if (payload.email !== decoded.email) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'you are forbidden');
    }
    //encrypted new password:
    const newHasPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield user_model_1.User.findOneAndUpdate({
        email: decoded.email,
        role: decoded.role,
    }, {
        password: newHasPassword,
        passwordChangeAt: new Date(),
    });
    return null;
});
exports.AuthService = {
    loginUser,
    registerUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
