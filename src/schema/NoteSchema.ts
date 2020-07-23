import { gql } from "apollo-server";

export const Note = gql`
  type Query {
    notes: [Note]!
  }

  type Note {
    id: ID!
    content: String!
    time: String!
  }
`;
