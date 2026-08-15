import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import noteService from "./note.service";
import { Request, Response } from "express";

const createNoteController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await noteService.createNoteIntoDB(payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Note created successfully',
    data: result,
  });
});

const updateNoteController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await noteService.updateNoteIntoDB(id as string, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Note updated successfully',
    data: result,
  });
});

const deleteNoteController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await noteService.deleteNoteFromDB(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Note deleted successfully',
    data: result,
  });
});

const getSingleNoteController = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await noteService.getSingleNoteFromDB(slug as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Note fetched successfully',
    data: result,
  });
});

const getAllNotesController = catchAsync(async (req: Request, res: Response) => {
  const result = await noteService.getAllNotesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Notes fetched successfully',
    data: result,
  });
});

export const noteController = {
  createNoteController,
  updateNoteController,
  deleteNoteController,
  getSingleNoteController,
  getAllNotesController,
};