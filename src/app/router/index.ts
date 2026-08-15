import { Router } from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { userRoute } from '../modules/user/user.route';
import { noteRoute } from '../modules/note/note.route';


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
];

routeModules.forEach((route) => router.use(route.path, route?.route));

export default router;