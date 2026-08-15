"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const noteSchema = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().min(1, 'Title is required'),
        slug: zod_1.default.string().optional(),
        content: zod_1.default.string().min(1, 'Content is required'),
    }),
});
const updateNoteSchema = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().optional(),
        slug: zod_1.default.string().optional(),
        content: zod_1.default.string().optional(),
    }).strict()
});
exports.noteValidation = {
    noteSchema,
    updateNoteSchema,
};
