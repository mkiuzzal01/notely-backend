import { Router } from "express";
import { USER_ROLE } from "../user/user.constant";
import { auth } from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { noteValidation } from "./note.validation";
import { noteController } from "./note.controller";

const route = Router();

route.post(
  '/create',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validationRequest(noteValidation.noteSchema),
  noteController.createNoteController,
);
route.get(
  '/all',
  auth(USER_ROLE.admin, USER_ROLE.user),
  noteController.getAllNotesController,
);
route.get(
  '/:slug',
  auth(USER_ROLE.admin, USER_ROLE.user),
  noteController.getSingleNoteController,
);
route.patch(
  '/update/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validationRequest(noteValidation.updateNoteSchema),
  noteController.updateNoteController,
);
route.delete(
  '/delete/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  noteController.deleteNoteController,
);

export const noteRoute = route;