import { Router } from 'express';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';
import validationRequest from '../../middlewares/validationRequest';
import { postController } from './post.controller';

const route = Router();

route.post('/create', auth(USER_ROLE.admin, USER_ROLE.user), postController.createPostController);
route.get('/all', auth(USER_ROLE.admin, USER_ROLE.user), postController.getAllPostsController);
route.get('/:slug', auth(USER_ROLE.admin, USER_ROLE.user), postController.getSinglePostController);
route.patch('/update/:id', auth(USER_ROLE.admin, USER_ROLE.user), postController.updatePostController);
route.delete('/delete/:id', auth(USER_ROLE.admin, USER_ROLE.user), postController.deletePostController);

export const postRoute = route;
