"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const GENDERS = ['male', 'female', 'other'];
const nameSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required'),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
});
const locationSchema = zod_1.z.object({
    presentAddress: zod_1.z.string().min(1, 'Present address is required'),
    permanentAddress: zod_1.z.string().min(1, 'Permanent address is required'),
});
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: nameSchema,
        slug: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().optional(),
        address: locationSchema.optional(),
        gender: zod_1.z.enum(GENDERS),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        image: zod_1.z.string().url('Image must be a valid URL').optional(),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: nameSchema.partial().optional(),
        slug: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        phone: zod_1.z.string().optional(),
        address: locationSchema.partial().optional(),
        gender: zod_1.z.enum(GENDERS).optional(),
        image: zod_1.z.string().url('Image must be a valid URL').optional(),
    }).strict()
});
exports.userValidation = {
    userValidationSchema,
    updateUserValidationSchema,
};
