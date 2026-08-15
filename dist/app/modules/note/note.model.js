"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    content: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
//for create user slug:
noteSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug =
            `${this.title}`
                .toLowerCase()
                .replace(/ /g, '-');
    }
});
//for update user slug:
noteSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (update &&
        typeof update === 'object' &&
        !Array.isArray(update) &&
        'title' in update) {
        update.slug =
            `${update.title}`
                .toLowerCase()
                .replace(/ /g, '-');
        this.setUpdate(update);
    }
});
exports.Note = (0, mongoose_1.model)('Note', noteSchema);
