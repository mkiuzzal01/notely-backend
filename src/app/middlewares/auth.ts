import { NextFunction, Request, Response } from 'express';
import '../interface';
import AppError from '../errors/AppError';
import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import config from '../config';

export const auth = (...requiredRole: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = (req.headers.authorization as string) || '';
        if (!authHeader) {
            throw new AppError(status.UNAUTHORIZED, 'you are not authorized');
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        // verified token with decode:
        const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

        // verification of role and authorization :
        const { role, email, iat } = decoded;

        const isUserExist = await User.findOne({ email: email });

        if (!isUserExist) {
            throw new AppError(status.NOT_FOUND, 'User not found');
        }

        const isDeleted = isUserExist?.isDeleted;
        if (isDeleted === true) {
            throw new AppError(status.FORBIDDEN, 'User is deleted');
        }
        const userStatus = isUserExist?.status;

        if (userStatus === 'blocked') {
            throw new AppError(status.FORBIDDEN, 'User is blocked');
        }

        //check password change time and token issue time:
        const checkTime = await User.isJwtIssuedBeforePasswordChange(
            isUserExist?.passwordChangeAt as Date,
            iat as number,
        );

        if (checkTime) {
            throw new AppError(status.FORBIDDEN, 'Token has expired or is invalid');
        }

        if (requiredRole && !requiredRole.includes(role as any)) {
            throw new AppError(status.UNAUTHORIZED, 'you are not authorized');
        }

        // attach consistent user info for downstream ownership checks
        req.user = {
            id: isUserExist._id?.toString(),
            email: isUserExist.email,
            role: isUserExist.role,
            iat,
        } as unknown as JwtPayload;

        next();
    });
};