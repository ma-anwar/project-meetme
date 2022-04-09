// https://stackoverflow.com/questions/58848625/access-messages-in-express-validator
import { validationResult } from "express-validator";
import httpStatus from "http-status";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const allErrors = [];
    errors.array().map((err) => allErrors.push({ [err.param]: err.msg }));

    return res.status(httpStatus.BAD_REQUEST).json({
        errors: allErrors,
    });
};

export default validate;
