import { RedisPubSub } from "graphql-redis-subscriptions";
import getRedisClient from "../utils/redisLoader";
import { slotCreationRules } from "./timeslotValidators";

const pubsub = new RedisPubSub({
    publisher: getRedisClient(),
    subscriber: getRedisClient(),
});

const SLOT_UPDATED = "slot_updated";

const publish = async (type, slot) => {
    pubsub
        .publish(SLOT_UPDATED, {
            slotUpdated: { type, slot },
        })
        .catch((err) => {
            console.log(err);
        });
};

const createSlots = async (parent, { input }, { models, user }) => {
    const { eventId, slots } = input;

    await models.Event.throwIfNotOwner(eventId, user._id);

    const createdSlots = await models.Timeslot.create(...slots);

    await models.Event.addSlots(eventId, createdSlots);

    createdSlots.map((slot) => publish("CREATE", slot));

    return createdSlots;
};

const bookSlot = async (parent, { input }, { models, user }) => {
    const { eventId, slotId, title = "", comment = "" } = input;

    await models.Event.throwIfOwner(eventId, user._id);

    const toBeUpdated = await models.Event.bookSlot(
        eventId,
        slotId,
        user._id,
        title,
        comment
    );

    const updatedSlot = await models.Event.getSlot(eventId, slotId);
    publish("UPDATE", updatedSlot);

    return toBeUpdated;
};

const unbookSlot = async (parent, { input }, { models }) => {
    // TODO: Check that booker is unbooking
    const { eventId, slotId, title = "", comment = "" } = input;

    await models.Event.unbookSlot(eventId, slotId, title, comment);

    const updatedSlot = await models.Event.getSlot(eventId, slotId);

    publish("UPDATE", updatedSlot);

    return updatedSlot;
};

const deleteSlot = async (parent, { input }, { models, user }) => {
    // TODO: Check if slot is already booked
    const { eventId, slotId } = input;

    await models.Event.throwIfNotEvent(eventId);
    await models.Event.throwIfNotOwner(eventId, user._id);

    const toDelete = await models.Event.getSlot(eventId, slotId);

    await models.Event.deleteSlot(eventId, slotId);
    publish("DELETE", toDelete);

    return toDelete;
};

const getSlot = async (parent, { input }, { models }) => {
    const { eventId, slotId } = input;
    const slot = await models.Event.getSlot(eventId, slotId);
    return slot;
};

const addPeerId = async (parent, { input }, { models }) => {
    const { eventId, slotId, peerId } = input;
    await models.Event.addPeerId(eventId, slotId, peerId);

    const updatedSlot = await models.Event.getSlot(eventId, slotId);
    publish("UPDATE", updatedSlot);

    return updatedSlot;
};

const timeslotResolvers = {
    Query: {
        getSlot,
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
            subscribe: (_, args) => pubsub.asyncIterator([SLOT_UPDATED]),
        },
    },
};

export default timeslotResolvers;
