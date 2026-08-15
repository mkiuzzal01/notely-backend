import status from 'http-status';
import AppError from '../../errors/AppError';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { postSearchableFields } from './post.constant';
import QueryBuilder from '../../builder/queryBuilder';

const createPostIntoDB = async (user: IUser, payload: IPost) => {
  const isExists = await User.findOne({ email: user.email });
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const postPayload = {
    ...payload,
    userId: isExists._id,
  };

  const result = await Post.create(postPayload);
  return result;
};

const updatePostIntoDB = async (id: string, payload: Partial<IPost>) => {
  const isExists = await Post.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Post not found');
  }

  const updatePostPayload = {
    title: payload.title || isExists.title,
    content: payload.content || isExists.content,
  };

  const result = await Post.findOneAndUpdate({ _id: id }, updatePostPayload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletePostFromDB = async (id: string) => {
  const isExists = await Post.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Post not found');
  }
  await Post.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true, runValidators: true });
  return null;
};

const getSinglePostFromDB = async (slug: string) => {
  const isExists = await Post.findOne({ slug });
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Post not found');
  }
  return isExists;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find({ isDeleted: { $ne: true } }).populate('userId', 'name email'), query)
    .filter()
    .search(postSearchableFields)
    .sort()
    .paginate();

  const meta = await postQuery.countTotal();
  const result = await postQuery.modelQuery;

  return { result, meta };
};

export default {
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
  getSinglePostFromDB,
  getAllPostsFromDB,
};
