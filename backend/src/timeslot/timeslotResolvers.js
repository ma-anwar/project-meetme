import { RedisPubSub } from "graphql-redis-subscriptions";
import { withFilter } from "graphql-subscriptions";
import getRedisClient from "../utils/redisLoader";
import { slotCreationRules } from "./timeslotValidators";

const pubsub = new RedisPubSub({
    publisher: getRedisClient(),
    subscriber: getRedisClient(),
});

const SLOT_UPDATED = "slot_updated";

const publish = async (eventId, type, slot) => {
    pubsub
        .publish(`${SLOT_UPDATED}.${eventId}`, {
            slotUpdated: { type, slot },
        })
        .catch((err) => {
            console.log(err);
        });
};

const createSlots = async (parent, { input }, { models, user }) => {
    const { eventId, slots } = input;

    await models.Event.throwIfNotOwner(eventId, user._id);

    const createdSlots = await models.Timeslot.createSlots(eventId, slots);

    // @DEPRECATED
    // await models.Event.addSlots(eventId, createdSlots);

    const createdSlotsArray = Array.isArray(createdSlots)
        ? createdSlots
        : [createdSlots];

    const populatedResult = await Promise.all(
        createdSlotsArray.map((slot) => slot.populate("bookerId"))
    );
    populatedResult.map((slot) => publish(eventId, "CREATE", slot));

    return populatedResult;
};

const bookSlot = async (parent, { input }, { models, user }) => {
    const { eventId, slotId, title = "", comment = "" } = input;

    await models.Event.throwIfOwner(eventId, user._id);

    // @DEPRECATED
    /*
    const toBeUpdated = await models.Event.bookSlot(
        eventId,
        slotId,
        user._id,
        title,
        comment
    );
    */

    const bookedSlot = await models.Timeslot.bookSlot(
        slotId,
        user._id,
        title,
        comment
    );

    await bookedSlot.populate("bookerId");
    publish(eventId, "UPDATE", bookedSlot);

    return bookedSlot;
};

const unbookSlot = async (parent, { input }, { models }) => {
    // TODO: Check that booker is unbooking
    const { eventId, slotId, title = "", comment = "" } = input;

    // @DEPRECATED
    // await models.Event.unbookSlot(eventId, slotId, title, comment);

    const unbookedSlot = await models.Timeslot.unbookSlot(slotId);
    await unbookedSlot.populate("bookerId");

    publish(eventId, "UPDATE", unbookedSlot);

    return unbookedSlot;
};

const deleteSlot = async (parent, { input }, { models, user }) => {
    // TODO: Check if slot is already booked
    const { eventId, slotId } = input;

    await models.Event.throwIfNotEvent(eventId);
    await models.Event.throwIfNotOwner(eventId, user._id);

    // @DEPRECATED
    // const toDelete = await models.Event.getSlot(eventId, slotId);
    const toDelete = await models.Timeslot.getSlot(slotId);
    await toDelete.populate("bookerId");

    await models.Timeslot.deleteSlot(slotId);
    //
    // @DEPRECATED
    // await models.Event.deleteSlot(eventId, slotId);
    publish(eventId, "DELETE", toDelete);

    return toDelete;
};

const getSlot = async (parent, { input }, { models }) => {
    const { eventId, slotId } = input;
    const slot = await models.Timeslot.getSlot(slotId);
    await slot.populate("bookerId");
    return slot;
};

const addPeerId = async (parent, { input }, { models }) => {
    const { eventId, slotId, peerId } = input;
    // await models.Event.addPeerId(eventId, slotId, peerId);
    const updatedSlot = await models.Timeslot.addPeerId(slotId, peerId);
    await updatedSlot.populate("bookerId");
    publish(eventId, "UPDATE", updatedSlot);

    return updatedSlot;
};

const getSlotsBetween = async (parent, { input }, { models }) => {
    const { eventId, start, end } = input;
    const result = await models.Timeslot.getSlotsBetween(eventId, start, end);
    const populatedResult = await Promise.all(
        result.map((slot) => slot.populate("bookerId"))
    );
    return populatedResult;
};

const timeslotResolvers = {
    Query: {
        getSlot,
        getSlotsBetween,
    },
    Mutation: {
        createSlots,
        bookSlot,
        unbookSlot,
        deleteSlot,
        addPeerId,
    },
    Subscription: {
        slotUpdated: {
            subscribe: withFilter(
                (_, args) =>
                    pubsub.asyncIterator(`${SLOT_UPDATED}.${args.eventId}`),
                (payload, variables) =>
                    variables.start <= payload.slotUpdated.slot.start &&
                    variables.end >= payload.slotUpdated.slot.end
            ),
        },
    },
};

export default timeslotResolvers;
