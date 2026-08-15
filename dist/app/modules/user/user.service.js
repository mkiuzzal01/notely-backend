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
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield user_model_1.User.findOne({ email: payload.email });
    if (isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User already exists with this email');
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
const updateUserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log("Hello");
    const isExists = yield user_model_1.User.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updateUserPayload = {
        name: {
            firstName: ((_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName) || isExists.name.firstName,
            middleName: ((_b = payload === null || payload === void 0 ? void 0 : payload.name) === null || _b === void 0 ? void 0 : _b.middleName) || isExists.name.middleName,
            lastName: ((_c = payload === null || payload === void 0 ? void 0 : payload.name) === null || _c === void 0 ? void 0 : _c.lastName) || isExists.name.lastName,
        },
        email: payload.email || isExists.email,
        address: {
            presentAddress: ((_d = payload === null || payload === void 0 ? void 0 : payload.address) === null || _d === void 0 ? void 0 : _d.presentAddress) || ((_e = isExists.address) === null || _e === void 0 ? void 0 : _e.presentAddress),
            permanentAddress: ((_f = payload === null || payload === void 0 ? void 0 : payload.address) === null || _f === void 0 ? void 0 : _f.permanentAddress) || ((_g = isExists.address) === null || _g === void 0 ? void 0 : _g.permanentAddress),
        },
        phone: payload.phone || isExists.phone,
        gender: (payload === null || payload === void 0 ? void 0 : payload.gender) || isExists.gender,
        image: (payload === null || payload === void 0 ? void 0 : payload.image) || isExists.image,
    };
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updateUserPayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteUSerFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield user_model_1.User.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user_model_1.User.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true, runValidators: true });
    return null;
});
const getSingleUserFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield user_model_1.User.findOne({ slug });
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return isExists;
});
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
exports.userService = {
    createUserIntoDB,
    updateUserIntoDB,
    deleteUSerFromDB,
    getSingleUserFromDB,
    getAllUsersFromDB,
};
