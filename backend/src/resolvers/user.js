const userResolvers = {
    Query: {
        me: async (parent, args, { user }) => user,
        user: async (parent, { email }, { models }) =>
            models.User.findOne({ email }),
    },

    User: {
        eventsOwned: async (parent) => {
            const owner = parent;
            await owner.populate("eventsOwned");
            return owner.eventsOwned;
        },
    },
};

export default userResolvers;
