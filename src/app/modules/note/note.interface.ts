import { Types } from "mongoose";

export interface INote {
    title: string;
    slug?: string;
    content: string;
  author: Types.ObjectId;
    isDeleted: boolean;
}