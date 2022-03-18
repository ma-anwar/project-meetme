import { slotCreationRules } from "../validators/timeslotValidators";

// Broken query due to schema change
const createSlot = async (parent, { input }, { models }) => {
    const { eventId, datetime, note } = input;
    try {
        await slotCreationRules.validate(
            {
                datetime,
                eventId,
                note,
            },
            { abortEarly: false, context: { Events: models.Event } }
        );
    } catch (err) {
        return err;
    }

    // TODO: Ensure no overlap with other intervals
    const event = await models.Event.findOne({ _id: eventId });
    const fitsInEvent = await event.fitsInEvent(new Date(datetime));
    if (!fitsInEvent) {
        throw new Error(
            "Timeslot does not fit between the start and end dates of the event!"
        );
    }

    const timeslot = await models.Timeslot.create({ datetime, note });

    await models.Event.updateOne(
        { _id: eventId },
        { $push: { timeslots: timeslot } }
    );
    return timeslot;
};

const createSlots = async (parent, { input }, { models, user }) => {
    const { eventId, slots } = input;
    const event = await models.Event.findOne({ _id: eventId });
    if (!user._id.equals(event.ownerId)) {
        throw new Error("Unauthorized to create slots on non-owned calendar");
    }
    const createdSlots = await models.Timeslot.create(...slots);
    console.log("Starting");
    console.log(createdSlots);
    await models.Event.updateOne(
        { _id: eventId },
        { $push: { timeslots: createdSlots } }
    );
    const updatedEvent = await models.Event.findOne({ _id: eventId });
    await updatedEvent.populate("timeslots");
    console.log(updatedEvent);
    return updatedEvent.timeslots;
};

const timeslotResolvers = {
    Mutation: {
        createSlot,
        createSlots,
    },
};

export default timeslotResolvers;
