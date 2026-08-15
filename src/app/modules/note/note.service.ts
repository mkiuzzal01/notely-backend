import status from "http-status";
import AppError from "../../errors/AppError";
import { INote } from "./note.interface";
import { Note } from "./note.model";

const createNoteIntoDB = async (payload: INote) => {
  const result = await Note.create(payload);
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

const getAllNotesFromDB = async () => {
  const result = await Note.find({ isDeleted: false });
  return result;
};

export default {
  createNoteIntoDB,
  updateNoteIntoDB,
  deleteNoteFromDB,
  getSingleNoteFromDB,
  getAllNotesFromDB,
};
