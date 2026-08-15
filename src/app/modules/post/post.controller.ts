import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import postService from './post.service';
import { Request, Response } from 'express';
import { IUser } from '../user/user.interface';

const createPostController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user as IUser;
  const result = await postService.createPostIntoDB(user, payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

const updatePostController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await postService.updatePostIntoDB(id as string, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePostController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await postService.deletePostFromDB(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

const getSinglePostController = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await postService.getSinglePostFromDB(slug as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Post fetched successfully',
    data: result,
  });
});

const getAllPostsController = catchAsync(async (req: Request, res: Response) => {
  const { query } = req;
  const result = await postService.getAllPostsFromDB(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Posts fetched successfully',
    data: result,
  });
});

export const postController = {
  createPostController,
  updatePostController,
  deletePostController,
  getSinglePostController,
  getAllPostsController,
};
