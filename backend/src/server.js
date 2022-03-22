import { ApolloServer } from "apollo-server-express";

import models from "./models";
import schema from "./schema";
import resolvers from "./resolvers";

const BASIC_LOGGING = {
    requestDidStart(requestContext) {
        console.log("request started");
        console.log(requestContext.request.query);
        console.log(requestContext.request.variables);
        return {
            didEncounterErrors(requestContext) {
                console.log(
                    `an error happened in response to query ${ 
                        requestContext.request.query}`
                );
                console.log(requestContext.errors);
            },
        };
    },

    willSendResponse(requestContext) {
        console.log("response sent", requestContext.response);
    },
};

const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers,
    context: async ({ req }) => {
        const user = await models.User.findOne({ _id: req.session.user._id });
        return { models, user };
    },
    plugins: [BASIC_LOGGING],
});

export default server;