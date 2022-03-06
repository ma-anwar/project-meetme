const userResolvers = {
    Query: {
        me: async (parent, args, { user }) => user,
        user: async (parent, { email }, { models }) =>
            models.User.findOne({ email }),
    },

    Mutation: {
        // TODO: remove, left for testing right now
        signUp: async (parent, { username, email, password }, { models }) => {
            const user = await models.User.create({
                username,
                email,
                password,
            });

            return user;
        },
    },
};

export default userResolvers;
