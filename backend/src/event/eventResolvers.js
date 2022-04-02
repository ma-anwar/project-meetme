import { eventCreationRules } from "./eventValidator";

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

const deleteEvent = async (parent, { input }, { models }) => {
    const { eventId } = input;
    await models.Event.deleteOne({ _id: eventId }).catch((err) => {
        console.log(err);
        throw new Error("Deleting event failed");
    });
    return true;
};

const eventResolvers = {
    Query: {
        event: async (parent, { id }, { models }) =>
            models.Event.findOne({ _id: id })
                .populate("ownerId")
                .catch((err) => {
                    console.log(err);
                    throw new Error("Event not found");
                }),
    },

    Mutation: {
        createEvent,
        deleteEvent,
    },
};
export default eventResolvers;
