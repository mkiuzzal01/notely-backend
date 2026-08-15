import { Types } from 'mongoose';

export interface IPost {
  title: string;
  slug?: string;
  content: string;
  userId: Types.ObjectId;
  isDeleted: boolean;
}
