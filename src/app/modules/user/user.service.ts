import status from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/queryBuilder';
import { userSearchableFields } from './user.constant';

const createUserIntoDB = async (payload: IUser) => {
  const isExists = await User.findOne({ email: payload.email });
  if (isExists) {
    throw new AppError(status.NOT_FOUND, 'User already exists with this email');
  }
  const result = await User.create(payload);
  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
  const isExists = await User.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const updateUserPayload = {
    name: payload.name || isExists.name,
    email: payload.email || isExists.email,
    address:{
      presentAddress: payload?.address?.presentAddress || isExists.address?.presentAddress,
      permanentAddress: payload?.address?.permanentAddress || isExists.address?.permanentAddress,
    },
    phone: payload.phone || isExists.phone,
    gender:payload?.gender || isExists.gender,
    image: payload?.image || isExists.image,
    }

  const result = await User.findOneAndUpdate({ _id: id }, updateUserPayload,{
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteUSerFromDB = async (id: string) => {
  const isExists = await User.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  await User.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return null;
};

const getSingleUserFromDB = async (slug: string) => {
  const isExists = await User.findOne({ slug });
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  return isExists;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isDeleted: { $ne: true } }).select('-password'), query).filter().search(userSearchableFields).sort().paginate();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return { result, meta };
};

export const userService = {
  createUserIntoDB,
  updateUserIntoDB,
  deleteUSerFromDB,
  getSingleUserFromDB,
  getAllUsersFromDB,
};