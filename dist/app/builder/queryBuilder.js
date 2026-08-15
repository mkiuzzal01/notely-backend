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
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableField) {
        const searchTerm = this.query.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableField.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
            'priceMin',
            'priceMax',
        ];
        excludeFields.forEach((field) => delete queryObj[field]);
        const priceMin = this.query.priceMin ? Number(this.query.priceMin) : null;
        const priceMax = this.query.priceMax ? Number(this.query.priceMax) : null;
        const priceConditions = [];
        if (priceMin !== null) {
            priceConditions.push({
                $gte: [
                    {
                        $cond: [
                            { $lt: ['$discount', 100] },
                            {
                                $subtract: [
                                    '$price',
                                    { $multiply: ['$price', { $divide: ['$discount', 100] }] },
                                ],
                            },
                            { $subtract: ['$price', '$discount'] },
                        ],
                    },
                    priceMin,
                ],
            });
        }
        if (priceMax !== null) {
            priceConditions.push({
                $lte: [
                    {
                        $cond: [
                            { $lt: ['$discount', 100] },
                            {
                                $subtract: [
                                    '$price',
                                    { $multiply: ['$price', { $divide: ['$discount', 100] }] },
                                ],
                            },
                            { $subtract: ['$price', '$discount'] },
                        ],
                    },
                    priceMax,
                ],
            });
        }
        if (priceConditions.length > 0) {
            this.modelQuery = this.modelQuery.find(Object.assign({ $expr: { $and: priceConditions } }, queryObj));
        }
        else {
            this.modelQuery = this.modelQuery.find(queryObj);
        }
        return this;
    }
    sort() {
        var _a, _b;
        const sort = ((_b = (_a = this.query.sort) === null || _a === void 0 ? void 0 : _a.split(',')) === null || _b === void 0 ? void 0 : _b.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit);
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b;
        const fields = ((_b = (_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(',')) === null || _b === void 0 ? void 0 : _b.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPages = Math.ceil(total / limit);
            return {
                total,
                limit,
                page,
                totalPages,
            };
        });
    }
}
exports.default = QueryBuilder;
