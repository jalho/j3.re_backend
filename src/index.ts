import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import schema from "./schema/GraphQL";
import resolvers from "./resolvers";
import { getEnvironmentVariables, decodeToken } from "./utils/helpers";
import { User } from "./types";

const { PORT, MONGODB_URI } = getEnvironmentVariables();

const server = new ApolloServer(
  {
    typeDefs: schema,
    resolvers,
    context: ({ req }) => {
      const context: { user?: User, remoteAddress?: unknown } = {
        user: undefined,
        remoteAddress: undefined
      };
      // decode possible authorized user from token
      const authorization = req.headers.authorization || null;
      const token = authorization ? authorization.substring(7) : null;
      if (token) {
        const user = decodeToken(token);
        if (user) context.user = user;
      }
      // get remote address (IP address where the request came from)
      const remoteAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      if (remoteAddr) context.remoteAddress = remoteAddr;
      return context;
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
