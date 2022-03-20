import { body } from "express-validator";

const usernameRule = body("username")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 character long")
    .isLength({ max: 50 })
    .withMessage("Must be less than 50 character long");
const passwordRule = body("password")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Must be at least 6 characters long")
    .isLength({ max: 50 })
    .withMessage("Must be less than 50 characters long");
const emailRule = body("email")
    .exists()
    .isEmail()
    .withMessage("Must be a valid email")
    .isLength({ max: 50 })
    .withMessage("Must be less than 50 characters long")
    .normalizeEmail();

const signupRules = () => [usernameRule, emailRule, passwordRule];

const loginRules = () => [emailRule, passwordRule];

export { signupRules, loginRules };
