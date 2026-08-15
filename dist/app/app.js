"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const NotFound_1 = __importDefault(require("./utils/NotFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ['localhost:3000'] }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.text());
// Home route:
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the Notely API',
        version: '1.0.0',
        date: new Date().toDateString(),
        author: 'MKI_UZZAL',
    });
});
// All application routes:
app.use('/api/v1/', router_1.default);
// This is just test:
app.get('/test', (req, res) => {
    Promise.reject();
    res.send(req);
});
app.use(globalErrorHandler_1.default);
app.use(NotFound_1.default);
exports.default = app;
