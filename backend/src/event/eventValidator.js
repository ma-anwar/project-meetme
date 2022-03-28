import * as yup from "yup";
import startOfDay from "date-fns/startOfDay";

const title = yup
    .string()
    .required("Event must have a title")
    .min(1, "Title must be at least 1 character long")
    .max(255, "Title can't be more than 255 characters");

const description = yup
    .string()
    .optional()
    .max(1000, "Description can't be longer than 1000 characters");

const timeslotLength = yup
    .number()
    .required()
    .positive("timeslot length cannot be negative");

const location = yup
    .string()
    .required()
    .min(1, "Location must be at least 1 character long");

const startDate = yup.date().required();

const endDate = yup.date().required();

export const eventCreationRules = yup.object().shape({
    title,
    description,
    timeslotLength,
    location,
    startDate,
    endDate,
});
