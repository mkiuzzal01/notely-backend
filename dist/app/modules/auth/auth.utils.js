"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//for creating token:
const createToken = (jwtPayload, accessTokenSecret, expiresIn) => {
    const options = {
        expiresIn: expiresIn,
    };
    return jsonwebtoken_1.default.sign(jwtPayload, accessTokenSecret, options);
};
exports.createToken = createToken;
//for verifying token:
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
