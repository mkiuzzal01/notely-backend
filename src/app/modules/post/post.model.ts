import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Index on userId as required
postSchema.index({ userId: 1 });

// Explicit index for slug visibility
postSchema.index({ slug: 1 }, { unique: true, sparse: true });

export const Post = model<IPost>('Post', postSchema);
