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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const note_model_1 = require("./note.model");
const user_model_1 = require("../user/user.model");
const note_constant_1 = require("./note.constant");
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const createNoteIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield user_model_1.User.findOne({ email: user.email });
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const notePayload = Object.assign(Object.assign({}, payload), { userId: isExists._id });
    const result = yield note_model_1.Note.create(notePayload);
    return result;
});
const updateNoteIntoDB = (id, payload, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield note_model_1.Note.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    // ownership check for non-admins
    if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== 'admin' && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== 'superAdmin') {
        if (isExists.userId.toString() !== currentUser.id) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not allowed to modify this note');
        }
    }
    const updateNotePayload = {
        title: payload.title || isExists.title,
        content: payload.content || isExists.content,
    };
    const result = yield note_model_1.Note.findOneAndUpdate({ _id: id }, updateNotePayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteNoteFromDB = (id, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield note_model_1.Note.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    // ownership check for non-admins
    if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== 'admin' && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== 'superAdmin') {
        if (isExists.userId.toString() !== currentUser.id) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not allowed to delete this note');
        }
    }
    yield note_model_1.Note.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true, runValidators: true });
    return null;
});
const getSingleNoteFromDB = (slug, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield note_model_1.Note.findOne({ slug }).populate('userId', 'name email');
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    if (currentUser && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== 'admin' && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== 'superAdmin') {
        if (isExists.userId.toString() !== currentUser.id) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not allowed to view this note');
        }
    }
    return isExists;
});
const getAllNotesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const noteQuery = new queryBuilder_1.default(note_model_1.Note.find({ isDeleted: { $ne: true } }).populate('userId', 'name email'), query).filter().search(note_constant_1.noteSearchableFields).sort().paginate();
    const meta = yield noteQuery.countTotal();
    const result = yield noteQuery.modelQuery;
    return { result, meta };
});
exports.default = {
    createNoteIntoDB,
    updateNoteIntoDB,
    deleteNoteFromDB,
    getSingleNoteFromDB,
    getAllNotesFromDB,
};
