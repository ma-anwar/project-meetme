//https://github.com/davidyaha/graphql-redis-subscriptions - dynamic subscriptions
import { RedisPubSub } from "graphql-redis-subscriptions";
import { withFilter } from "graphql-subscriptions";
import { getUnixTime, endOfDay, startOfDay, fromUnixTime } from "date-fns";
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

export const applyToEpoch = (fn, epochTime) => {
    const mult = getUnixTime(epochTime) * 1000;
    const date = fromUnixTime(mult);
    const applied = fn(date);
    const epoch = getUnixTime(applied);
    return epoch.toString();
};

const createSlots = async (parent, { input }, { models, user }) => {
    const { eventId, slots } = input;

    await models.Event.throwIfNotOwner(eventId, user._id);

    const event = await models.Event.findOne({ _id: eventId });
    const minStart = slots.reduce((prev, curr) =>
        prev.start < curr.start ? prev : curr
    );
    const maxEnd = slots.reduce((prev, curr) =>
        prev.end > curr.end ? prev : curr
    );
    if (
        minStart.start < applyToEpoch(startOfDay, event.startDate) ||
        maxEnd.end > applyToEpoch(endOfDay, event.endDate)
    ) {
        throw new Error("Slots must be between event start and end date");
    }

    const createdSlots = await models.Timeslot.createSlots(eventId, slots);

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

    const slot = await models.Timeslot.getSlot(slotId);
    if (slot.bookerId) {
        throw new Error("Can't book slot that's already booked");
    }

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

const unbookSlot = async (parent, { input }, { models, user }) => {
    const { eventId, slotId, title = "", comment = "" } = input;

    const slot = await models.Timeslot.getSlot(slotId);
    if (!slot.bookerId.equals(user._id)) {
        throw new Error("Can't unbook someone elses slot");
    }
    const unbookedSlot = await models.Timeslot.unbookSlot(slotId);
    await unbookedSlot.populate("bookerId");

    publish(eventId, "UPDATE", unbookedSlot);

    return unbookedSlot;
};

const deleteSlot = async (parent, { input }, { models, user }) => {
    const { eventId, slotId } = input;

    const slot = await models.Timeslot.getSlot(slotId);
    if (slot.bookerId) {
        throw new Error("Can't delete booked slot");
    }

    await models.Event.throwIfNotEvent(eventId);
    await models.Event.throwIfNotOwner(eventId, user._id);

    const toDelete = await models.Timeslot.getSlot(slotId);
    await toDelete.populate("bookerId");

    await models.Timeslot.deleteSlot(slotId);
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
    const { eventId, slotId, peerId, peerCallEnded } = input;
    const updatedSlot = await models.Timeslot.addPeerId(
        slotId,
        peerId,
        peerCallEnded
    );
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
