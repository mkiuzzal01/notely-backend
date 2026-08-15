import z from "zod";

const noteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
  }),
});

const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
  }).strict()
});

export const noteValidation = {
  noteSchema,
  updateNoteSchema,
};