import { ApolloServer } from "apollo-server";
// import mongoose from "mongoose"; // TODO

import schema from "./schema";
import resolvers from "./resolvers";
import { getEnvironmentVariables } from "./utils/helpers";

const { PORT, MONGODB_URI } = getEnvironmentVariables();
const server = new ApolloServer({ typeDefs: schema, resolvers });

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
  // TODO: Connect to the database!
});
