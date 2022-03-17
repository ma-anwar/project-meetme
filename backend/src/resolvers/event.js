import { eventCreationRules } from "../validators/eventValidator";

const createEvent = async (parent, { input }, { models, user }) => {
    const { title, description, location, startDate, endDate, timeslotLength } =
        input;
    try {
        await eventCreationRules.validate(
            {
                title,
                description,
                timeslotLength,
                location,
                startDate,
                endDate,
            },
            { abortEarly: false }
        );
    } catch (err) {
        return err;
    }

    const exceedsEventLimit = await user.exceedsEventLimit();
    if (exceedsEventLimit) {
        throw new Error("Event threshold exceeded");
    }

    const event = await models.Event.create({
        title,
        description,
        location,
        ownerId: user._id,
        startDate,
        endDate,
        timeslotLength,
    });

    await user.eventsOwned.push(event);
    await user.save();
    await event.populate("ownerId");

    return event;
};

const eventResolvers = {
    Query: {
        event: async (parent, { id }, { models }) =>
            models.Event.findOne({ id }).populate("ownerId"),
    },

    Mutation: {
        createEvent,
    },
};
export default eventResolvers;
