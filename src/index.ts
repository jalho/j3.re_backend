import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import schema from "./schema/GraphQL";
import resolvers from "./resolvers";
import { getEnvironmentVariables } from "./utils/helpers";

const { PORT, MONGODB_URI } = getEnvironmentVariables();

const server = new ApolloServer(
  {
    typeDefs: schema,
    resolvers,
    context: () => {
      /* TODO: Parse token from authorization header ("bearer..."), and decode user information from the token. Example:
      https://www.apollographql.com/docs/apollo-server/security/authentication/#putting-user-info-on-the-context. */
      // const authorization = req.headers.authorization || "";
      // const loggedInUser = ...
      return {
        // loggedInUser
      };
    }
  }
);

const mongodbConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

server.listen({ port: PORT })
  .then(({ url }) => console.log(`Server ready at ${url}\nConnecting to database...`))
  .then(() => mongoose.connect(MONGODB_URI, mongodbConnectionOptions))
  .then(
    () => console.log("Connected to database."),
    () => console.log("Connection failed.")
  );
