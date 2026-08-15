/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryFilter, Query } from 'mongoose';

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableField: string[]) {
        const searchTerm = this.query.searchTerm as string;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableField.map(
                    (field) =>
                        ({
                            [field]: { $regex: searchTerm, $options: 'i' },
                        }) as QueryFilter<T>,
                ),
            });
        }

        return this;
    }

    filter() {
        const queryObj = { ...this.query };
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

        const priceConditions: any[] = [];

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
            this.modelQuery = this.modelQuery.find({
                $expr: { $and: priceConditions },
                ...queryObj,
            });
        } else {
            this.modelQuery = this.modelQuery.find(queryObj as QueryFilter<T>);
        }

        return this;
    }

    sort() {
        const sort =
            (this.query.sort as string)?.split(',')?.join(' ') || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort as string);
        return this;
    }

    paginate() {
        const page = Number(this.query?.page) || 1;
        const limit = Number(this.query?.limit);
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    fields() {
        const fields =
            (this.query.fields as string)?.split(',')?.join(' ') || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this.query?.page) || 1;
        const limit = Number(this.query?.limit) || 10;
        const totalPages = Math.ceil(total / limit);

        return {
            total,
            limit,
            page,
            totalPages,
        };
    }
}

export default QueryBuilder;