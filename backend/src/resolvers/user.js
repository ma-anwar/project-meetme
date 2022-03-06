const userResolvers = {
    Query: {
        users: async (parent, args, { models }) => models.User.find(),
        user: async (parent, { email }, { models }) =>
            models.User.findOne({ email }),
    },

    Mutation: {
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
