import { model, Schema } from 'mongoose';
import { IUser, userModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { USER_STATUS } from './user.constant';

const userSchema = new Schema<IUser, userModel>(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true },
        phone: { type: String, unique: true },
        address: {
            presentAddress: { type: String, required: true },
            permanentAddress: { type: String, required: true },
        },
        gender: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        passwordChangeAt: {
            type: Date,
        },
        role: {
            type: String,
            enum: ['superAdmin', 'admin', 'user'],
            default: 'user',
        },
        status: {
            type: String,
            enum: USER_STATUS,
            default: 'in-progress',
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// Hash password before saving:
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_round),
    );
});

// Hide password after saving
userSchema.post('save', function (doc) {
    doc.password = '';
});

//check password is match:
userSchema.statics.isPasswordMatch = async function (
    plaintextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
};

//for create user slug:
userSchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug =
            `${this.name}-${this.email}`
                .toLowerCase()
                .replace(/ /g, '-');
    }
});

//for update user slug:
userSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (
        update &&
        typeof update === 'object' &&
        !Array.isArray(update) &&
        'name' in update
    ) {
        (update as Record<string, unknown>).slug =
            `${update.name}-${update.email}`
                .toLowerCase()
                .replace(/ /g, '-');
        this.setUpdate(update);
    }
});

//check password change time and jwt token issue time:
userSchema.statics.isJwtIssuedBeforePasswordChange = async function (
    passwordChangeTime: Date,
    tokenIssuedTime: number,
) {
    const passChangeTime = passwordChangeTime?.getTime() / 1000;
    return passChangeTime > tokenIssuedTime;
};

export const User = model<IUser, userModel>('User', userSchema);