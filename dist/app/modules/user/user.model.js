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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    phone: { type: String, unique: true },
    address: {
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
    },
    gender: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    passwordChangeAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'user'],
        default: 'user',
    },
    status: {
        type: String,
        enum: user_constant_1.USER_STATUS,
        default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Hash password before saving:
userSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return;
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_round));
    });
});
// Hide password after saving
userSchema.post('save', function (doc) {
    doc.password = '';
});
//check password is match:
userSchema.statics.isPasswordMatch = function (plaintextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plaintextPassword, hashedPassword);
    });
};
//for create user slug:
userSchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug =
            `${this.name}-${this.email}`
                .toLowerCase()
                .replace(/ /g, '-');
    }
});
//for update user slug:
userSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (update &&
        typeof update === 'object' &&
        !Array.isArray(update) &&
        'name' in update) {
        update.slug =
            `${update.name}-${update.email}`
                .toLowerCase()
                .replace(/ /g, '-');
        this.setUpdate(update);
    }
});
//check password change time and jwt token issue time:
userSchema.statics.isJwtIssuedBeforePasswordChange = function (passwordChangeTime, tokenIssuedTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const passChangeTime = (passwordChangeTime === null || passwordChangeTime === void 0 ? void 0 : passwordChangeTime.getTime()) / 1000;
        return passChangeTime > tokenIssuedTime;
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
