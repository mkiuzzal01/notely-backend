import { Router } from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { userRoute } from '../modules/user/user.route';
import { noteRoute } from '../modules/note/note.route';
import { postRoute } from '../modules/post/post.route';


const router = Router();

const routeModules = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/note',
    route: noteRoute
  }
  ,
  {
    path: '/post',
    route: postRoute,
  }
];

routeModules.forEach((route) => router.use(route.path, route?.route));

export default router;