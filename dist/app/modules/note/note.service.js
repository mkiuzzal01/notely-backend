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
const createNoteIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield note_model_1.Note.create(payload);
    return result;
});
const updateNoteIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield note_model_1.Note.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
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
const deleteNoteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield note_model_1.Note.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    yield note_model_1.Note.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true, runValidators: true });
    return null;
});
const getSingleNoteFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield note_model_1.Note.findOne({ slug });
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    return isExists;
});
const getAllNotesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield note_model_1.Note.find({ isDeleted: false });
    return result;
});
exports.default = {
    createNoteIntoDB,
    updateNoteIntoDB,
    deleteNoteFromDB,
    getSingleNoteFromDB,
    getAllNotesFromDB,
};
