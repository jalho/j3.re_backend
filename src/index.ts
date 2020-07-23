import { ApolloServer } from "apollo-server";

import schema from "./schema";

const notes = [
  {
    id: "1234115212",
    content: "Lorem ipsum.",
    time: new Date().toISOString()
  },
  {
    id: "5863235232",
    content: "Kahvimuki.",
    time: new Date().toISOString()
  }
];

const resolvers = {
  Query: {
    notes: () => notes
  }
};

const server = new ApolloServer({ typeDefs: schema, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
