import { Types } from "mongoose";

export interface INote {
    title: string;
    slug?: string;
    content: string;
    userId: Types.ObjectId;
    isDeleted: boolean;
}