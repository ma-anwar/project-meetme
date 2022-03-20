import * as yup from "yup";

const note = yup
    .string()
    .optional()
    .min(1, "Note must be at least 1 character long")
    .max(1000, "Note can't be more than 1000 characters");
const datetime = yup
    .date()
    .required("Must supply a datetime")
    .min(new Date(), " can't start earlier than today");
const eventId = yup
    .mixed()
    .test("event-exists", "event does not exist", async function test(_id) {
        const exists = await this.options.context.Events.findOne({ _id });
        return exists;
    });

export const slotCreationRules = yup.object().shape({
    datetime,
    eventId,
    note,
});
