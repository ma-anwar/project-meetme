const userResolvers = {
    Query: {
        me: (_, args, { user }) => user,
        user: async (parent, { email }, { models }) =>
            models.User.findOne({ email }),
        eventsOwned: async (_, { email, page }, { models }) => {
            const user = await models.User.findOne(
                { email },
                { projection: { _id: 1 } }
            );
            const events = await models.Event.find({
                ownerId: user._id,
            })
                .sort({ created_at: -1 })
                .skip(page * 5)
                .limit(6);
            const hasMore = events.length === 6;
            return {
                events: events.slice(0, 5),
                hasMore,
            };
        },
    },
};

export default userResolvers;
