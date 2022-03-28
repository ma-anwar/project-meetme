import { slotCreationRules } from "./timeslotValidators";

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
    await models.Event.updateOne(
        { _id: eventId },
        { $push: { timeslots: createdSlots } }
    );
    const updatedEvent = await models.Event.findOne({ _id: eventId });
    await updatedEvent.populate("timeslots");
    return updatedEvent.timeslots;
};

const bookSlot = async (parent, { input }, { models, user }) => {
    const { eventId, slotId, title = "" } = input;
    let updatedSlot;
    try {
        updatedSlot = await models.Event.findOneAndUpdate(
            { " _id": eventId, "timeslots._id": slotId },
            {
                $set: {
                    "timeslots.$.bookerId": user,
                    "timeslots.$.title": title,
                },
            }
        );
    } catch (err) {
        console.log(err);
        throw new Error("Unable to update");
    }

    return updatedSlot;
};

const unbookSlot = async (parent, { input }, { models }) => {
    const { eventId, slotId, title = "" } = input;
    let updatedSlot;
    try {
        updatedSlot = await models.Event.findOneAndUpdate(
            { " _id": eventId, "timeslots._id": slotId },
            {
                $set: {
                    "timeslots.$.bookerId": null,
                    "timeslots.$.title": title,
                },
            }
        );
    } catch (err) {
        console.log(err);
        throw new Error("Unable to unbook slot");
    }

    return updatedSlot;
};

const deleteSlot = async (parent, { input }, { models }) => {
    const { eventId, slotId } = input;
    let deletedSlot;
    try {
        deletedSlot = await models.Event.findOneAndUpdate(
            {
                _id: eventId,
            },
            {
                $pull: {
                    timeslots: { _id: slotId },
                },
            }
        );
    } catch (err) {
        console.log(err);
        throw new Error("Deletion failed");
    }
    return deletedSlot;
};

const addPeerId = async (parent, { input }, { models }) => {
    const { eventId, slotId, peerId } = input;
    const updatedSlot = await models.Timeslot.addPeerId(
        eventId,
        slotId,
        peerId,
        models.Event
    );

    if (!updatedSlot) {
        throw new Error("Adding peerId failed");
    }

    return updatedSlot;
};

const timeslotResolvers = {
    Mutation: {
        createSlot,
        createSlots,
        bookSlot,
        unbookSlot,
        deleteSlot,
        addPeerId,
    },
};

export default timeslotResolvers;
