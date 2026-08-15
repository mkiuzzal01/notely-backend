/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryFilter, Query } from 'mongoose';

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    // 1. Search method
    search(searchableFields: string[]) {
        const searchTerm = this.query.searchTerm as string;
        if (searchTerm) {
            const searchFilter = {
                $or: searchableFields.map(
                    (field) => ({ [field]: { $regex: searchTerm, $options: 'i' } }) as QueryFilter<T>,
                ),
            } as Record<string, unknown>;

            const existingFilter = (this.modelQuery.getFilter && this.modelQuery.getFilter()) || {};
            this.modelQuery = this.modelQuery.find({ ...existingFilter, ...searchFilter } as QueryFilter<T>);
        }
        return this;
    }

    // 2. Filter method 
    filter() {
        const queryObj = { ...this.query };
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

        excludeFields.forEach((field) => delete queryObj[field]);

        const existingFilter = (this.modelQuery.getFilter && this.modelQuery.getFilter()) || {};
        const mergedFilter = { ...existingFilter, ...queryObj };

        this.modelQuery = this.modelQuery.find(mergedFilter as QueryFilter<T>);
        return this;
    }

    // 3. Sort method 
    sort() {
        const sort =
            (this.query.sort as string)?.split(',')?.join(' ') || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort as string);
        return this;
    }

    // 4. Paginate method
    paginate() {
        const page = Number(this.query?.page) || 1;
        const limit = Number(this.query?.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    // 5. Field limiting
    fields() {
        const fields =
            (this.query.fields as string)?.split(',')?.join(' ') || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    // 6. Pagination Metadata Generator
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