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
    context: ({ req }) => {
      const authorization = req.headers.authorization;
      // TODO: Remove the below prints.
      authorization
        ? console.log("Authorization header content:", authorization)
        : console.log("No authorization header found.");
      return authorization; // TODO: Parse token from the rest ("bearer... whatever")
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
