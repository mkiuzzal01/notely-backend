import { Router } from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { userRoute } from '../modules/user/user.route';


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
];

routeModules.forEach((route) => router.use(route.path, route?.route));

export default router;