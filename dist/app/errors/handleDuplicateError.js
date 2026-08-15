"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const handleDuplicateError = (error) => {
    const errorSource = [
        {
            path: Object.keys(error.keyPattern || {})[0] || '',
            message: 'Duplicate key error',
        },
    ];
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: 'Duplicate key error',
        errorSource,
    };
};
exports.default = handleDuplicateError;
