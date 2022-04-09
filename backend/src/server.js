import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";

import models from "./models";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";

const BASIC_LOGGING = {
    requestDidStart(requestContext) {
        console.log("request started");
        console.log(requestContext.request.query);
        console.log(requestContext.request.variables);
        return {
            didEncounterErrors(requestContext) {
                console.log(
                    `an error happened in response to query ${requestContext.request.query}`
                );
                console.log(requestContext.errors);
            },
        };
    },

    willSendResponse(requestContext) {
        console.log("response sent", requestContext.response);
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
    introspection: true,
    schema,
    resolvers,
    context: async ({ req }) => {
        const user = await models.User.findOne({ _id: req.session.user._id });
        return { models, user };
    },
});

export default server;
export { schema };
