import { ZodError, ZodIssue } from 'zod';
import status from 'http-status';
import { TErrorSource, TGenericErrorResponse } from '../interface/TError';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSource: TErrorSource[] = err.issues.map((issue: ZodIssue) => {
        const rawPath = issue?.path[issue.path.length - 1];
        const path: string | number =
            typeof rawPath === 'symbol' ? String(rawPath) : (rawPath as string | number);

        return {
            path,
            message: issue.message,
        };
    });

    return {
        statusCode: status.BAD_REQUEST,
        message: 'validation error',
        errorSource,
    };
};

export default handleZodError;