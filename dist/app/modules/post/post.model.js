"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String },
    content: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// Index on userId as required
postSchema.index({ userId: 1 });
// Explicit index for slug visibility
postSchema.index({ slug: 1 }, { unique: true, sparse: true });
exports.Post = (0, mongoose_1.model)('Post', postSchema);
