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
    author: isExists._id
  };

  const result = await Note.create(notePayload);
  return result;
}


const updateNoteIntoDB = async (id: string, payload: Partial<INote>) => {
  const isExists = await Note.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Note not found');
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

const deleteNoteFromDB = async (id: string) => {
  const isExists = await Note.findById(id);
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Note not found');
  }
  await Note.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return null;
};

const getSingleNoteFromDB = async (slug: string) => {
  const isExists = await Note.findOne({ slug });
  if (!isExists) {
    throw new AppError(status.NOT_FOUND, 'Note not found');
  }
  return isExists;
};

const getAllNotesFromDB = async (query: Record<string, unknown>) => {
  const noteQuery = new QueryBuilder(Note.find({ isDeleted: { $ne: true } }).populate('author', 'name email'), query).filter().search(noteSearchableFields).sort().paginate();

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
