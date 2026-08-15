import { Router } from 'express';
import { userController } from './user.controller';
import validationRequest from '../../middlewares/validationRequest';
import { userValidation } from './user.validation';
import { USER_ROLE } from './user.constant';
import { auth } from '../../middlewares/auth';

const route = Router();

route.get('/all', auth(USER_ROLE.admin, USER_ROLE.user), userController.getAllUsers);
route.get('/interests-group', auth(USER_ROLE.admin, USER_ROLE.user), userController.groupUsersByInterests);
route.get('/:id/posts', auth(USER_ROLE.admin, USER_ROLE.user), userController.getUserWithPosts);
route.get('/:slug', auth(USER_ROLE.admin, USER_ROLE.user), userController.getSingleUser);
route.post('/create', auth(USER_ROLE.admin), userController.createUser);
route.patch('/update/:id', auth(USER_ROLE.admin, USER_ROLE.user), validationRequest(userValidation.updateUserValidationSchema), userController.updateUser);
route.delete('/delete/:id', auth(USER_ROLE.admin), userController.deleteUser);

export const userRoute = route;