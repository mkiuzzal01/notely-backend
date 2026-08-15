"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRoute = void 0;
const express_1 = require("express");
const user_constant_1 = require("../user/user.constant");
const auth_1 = require("../../middlewares/auth");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const note_validation_1 = require("./note.validation");
const note_controller_1 = require("./note.controller");
const route = (0, express_1.Router)();
route.post('/create', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), (0, validationRequest_1.default)(note_validation_1.noteValidation.noteSchema), note_controller_1.noteController.createNoteController);
route.get('/all', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), note_controller_1.noteController.getAllNotesController);
route.get('/:slug', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), note_controller_1.noteController.getSingleNoteController);
route.patch('/update/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), (0, validationRequest_1.default)(note_validation_1.noteValidation.updateNoteSchema), note_controller_1.noteController.updateNoteController);
route.delete('/delete/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), note_controller_1.noteController.deleteNoteController);
exports.noteRoute = route;
