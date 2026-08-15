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
const post_model_1 = require("./post.model");
const user_model_1 = require("../user/user.model");
const post_constant_1 = require("./post.constant");
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const createPostIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield user_model_1.User.findOne({ email: user.email });
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const postPayload = Object.assign(Object.assign({}, payload), { userId: isExists._id });
    const result = yield post_model_1.Post.create(postPayload);
    return result;
});
const updatePostIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield post_model_1.Post.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    const updatePostPayload = {
        title: payload.title || isExists.title,
        content: payload.content || isExists.content,
    };
    const result = yield post_model_1.Post.findOneAndUpdate({ _id: id }, updatePostPayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deletePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield post_model_1.Post.findById(id);
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    yield post_model_1.Post.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true, runValidators: true });
    return null;
});
const getSinglePostFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield post_model_1.Post.findOne({ slug });
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    return isExists;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const postQuery = new queryBuilder_1.default(post_model_1.Post.find({ isDeleted: { $ne: true } }).populate('userId', 'name email'), query)
        .filter()
        .search(post_constant_1.postSearchableFields)
        .sort()
        .paginate();
    const meta = yield postQuery.countTotal();
    const result = yield postQuery.modelQuery;
    return { result, meta };
});
exports.default = {
    createPostIntoDB,
    updatePostIntoDB,
    deletePostFromDB,
    getSinglePostFromDB,
    getAllPostsFromDB,
};
