"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const user_validation_1 = require("./user.validation");
const user_constant_1 = require("./user.constant");
const auth_1 = require("../../middlewares/auth");
const route = (0, express_1.Router)();
route.get('/all', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), user_controller_1.userController.getAllUsers);
route.get('/:slug', (0, auth_1.auth)(user_constant_1.USER_ROLE.user), user_controller_1.userController.getSingleUser);
route.post('/create', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), user_controller_1.userController.createUser);
route.patch('/update/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.user), (0, validationRequest_1.default)(user_validation_1.userValidation.updateUserValidationSchema), user_controller_1.userController.updateUser);
route.delete('/delete/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), user_controller_1.userController.deleteUser);
exports.userRoute = route;
