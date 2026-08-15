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
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const user_constant_1 = require("./user.constant");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield user_model_1.User.findOne({ email: payload.email });
    if (isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User already exists with this email');
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
const updateUserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const isExists = yield user_model_1.User.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updateUserPayload = {
        name: payload.name || isExists.name,
        email: payload.email || isExists.email,
        address: {
            presentAddress: ((_a = payload === null || payload === void 0 ? void 0 : payload.address) === null || _a === void 0 ? void 0 : _a.presentAddress) || ((_b = isExists.address) === null || _b === void 0 ? void 0 : _b.presentAddress),
            permanentAddress: ((_c = payload === null || payload === void 0 ? void 0 : payload.address) === null || _c === void 0 ? void 0 : _c.permanentAddress) || ((_d = isExists.address) === null || _d === void 0 ? void 0 : _d.permanentAddress),
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
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new queryBuilder_1.default(user_model_1.User.find({ isDeleted: { $ne: true } }).select('-password'), query).filter().search(user_constant_1.userSearchableFields).sort().paginate();
    const meta = yield userQuery.countTotal();
    const result = yield userQuery.modelQuery;
    return { result, meta };
});
exports.userService = {
    createUserIntoDB,
    updateUserIntoDB,
    deleteUSerFromDB,
    getSingleUserFromDB,
    getAllUsersFromDB,
};
