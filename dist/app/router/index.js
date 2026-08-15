"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const router = (0, express_1.Router)();
const routeModules = [
    {
        path: '/auth',
        route: auth_route_1.authRoute,
    },
    {
        path: '/user',
        route: user_route_1.userRoute,
    },
];
routeModules.forEach((route) => router.use(route.path, route === null || route === void 0 ? void 0 : route.route));
exports.default = router;
