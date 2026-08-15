import { model, Schema } from "mongoose";
import { INote } from "./note.interface";

const noteSchema = new Schema<INote>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, sparse: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isDeleted: { type: Boolean, default: false }
    }
    , {
        timestamps: true,
    }
)

//for create user slug:
noteSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug =
            `${this.title}`
                .toLowerCase()
                .replace(/ /g, '-');
    }
});

//for update user slug:
noteSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (
        update &&
        typeof update === 'object' &&
        !Array.isArray(update) &&
        'title' in update
    ) {
        (update as Record<string, unknown>).slug =
            `${update.title}`
                .toLowerCase()
                .replace(/ /g, '-');
        this.setUpdate(update);
    }
});


export const Note = model<INote>('Note', noteSchema);