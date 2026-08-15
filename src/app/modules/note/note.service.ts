import status from "http-status";
import AppError from "../../errors/AppError";
import { INote } from "./note.interface";
import { Note } from "./note.model";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { noteSearchableFields } from "./note.constant";
import QueryBuilder from "../../builder/queryBuilder";

const createNoteIntoDB = async (user: IUser, payload: INote) => {

  const isExists = await User.findOne({ email: user.email });

  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const notePayload = {
    ...payload,
    userId: isExists._id
  };

  const result = await Note.create(notePayload);
  return result;
}


const updateNoteIntoDB = async (id: string, payload: Partial<INote>, currentUser: { id: string; role?: string }) => {
  const isExists = await Note.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Note not found');
  }

  // ownership check for non-admins
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'superAdmin') {
    if (isExists.userId.toString() !== currentUser.id) {
      throw new AppError(status.UNAUTHORIZED, 'You are not allowed to modify this note');
    }
  }

  const updateNotePayload = {
    title: payload.title || isExists.title,
    content: payload.content || isExists.content,
  };

  const result = await Note.findOneAndUpdate({ _id: id }, updateNotePayload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteNoteFromDB = async (id: string, currentUser: { id: string; role?: string }) => {
  const isExists = await Note.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Note not found');
  }

  // ownership check for non-admins
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'superAdmin') {
    if (isExists.userId.toString() !== currentUser.id) {
      throw new AppError(status.UNAUTHORIZED, 'You are not allowed to delete this note');
    }
  }

  await Note.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return null;
};

const getSingleNoteFromDB = async (slug: string, currentUser?: { id: string; role?: string }) => {
  const isExists = await Note.findOne({ slug }).populate('userId', 'name email');
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Note not found');
  }

  if (currentUser && currentUser?.role !== 'admin' && currentUser?.role !== 'superAdmin') {
    if (isExists.userId.toString() !== currentUser.id) {
      throw new AppError(status.UNAUTHORIZED, 'You are not allowed to view this note');
    }
  }

  return isExists;
};

const getAllNotesFromDB = async (query: Record<string, unknown>) => {
  const noteQuery = new QueryBuilder(Note.find({ isDeleted: { $ne: true } }).populate('userId', 'name email'), query).filter().search(noteSearchableFields).sort().paginate();

  const meta = await noteQuery.countTotal();
  const result = await noteQuery.modelQuery;

  return { result, meta };
};

export default {
  createNoteIntoDB,
  updateNoteIntoDB,
  deleteNoteFromDB,
  getSingleNoteFromDB,
  getAllNotesFromDB,
};
