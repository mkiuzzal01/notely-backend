import status from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: IUser) => {
  const isExists = await User.findOne({ email: payload.email });
  if (isExists) {
    throw new AppError(status.NOT_FOUND, 'User already exists with this email');
  }
  const result = await User.create(payload);
  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {

  console.log("Hello");

  const isExists = await User.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const updateUserPayload = {
    name:{
      firstName: payload?.name?.firstName || isExists.name.firstName,
      middleName: payload?.name?.middleName || isExists.name.middleName,
      lastName: payload?.name?.lastName || isExists.name.lastName,
    },
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

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

export const userService = {
  createUserIntoDB,
  updateUserIntoDB,
  deleteUSerFromDB,
  getSingleUserFromDB,
  getAllUsersFromDB,
};