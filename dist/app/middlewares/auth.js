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
exports.auth = void 0;
require("../interface");
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const config_1 = __importDefault(require("../config"));
const auth = (...requiredRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'you are not authorized');
        }
        //verified token with decode:
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        //verification of role and authorization :
        const { role, email, iat } = decoded;
        const isUserExist = yield user_model_1.User.findOne({
            email: email,
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
        //check password change time and token issue time:
        const checkTime = yield user_model_1.User.isJwtIssuedBeforePasswordChange(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.passwordChangeAt, iat);
        if (checkTime) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Token has expired or is invalid');
        }
        if (requiredRole && !requiredRole.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'you are not authorized');
        }
        req.user = decoded;
        next();
    }));
};
exports.auth = auth;
