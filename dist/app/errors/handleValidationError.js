"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (err) => {
    const errorSource = Object.keys(err.errors).map((key) => {
        const error = err.errors[key];
        return {
            path: error.path,
            message: error.message,
        };
    });
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: 'Validation error',
        errorSource,
    };
};
exports.default = handleValidationError;
