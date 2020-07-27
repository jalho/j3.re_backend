import { gql } from "apollo-server";

export const Note = gql`
  type Note {
    "Unique ID generated to the note by MongoDB (database)."
    id: ID!
    "Note's content."
    content: String!
    "Timestamp of leaving the note as determined by the server."
    time: String!
    "Whether or not the note has been manually approved, as the internet is a filthy place."
    approved: Boolean
  }

  type Query {
    "Get all notes from the database."
    notes: [Note]!
  }

  type Mutation {
    "Add a new note with given content. ID, timestamp and approval are determined by the system."
    addNote(content: String): Note
  }
`;
