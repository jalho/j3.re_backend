import { gql } from "apollo-server";

const Note = gql`
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
`;

const User = gql`
  type User {
    "Unique ID generated to the user by MongoDB (database)."
    id: ID!
    username: String!
    "The username's associated password's hash."
    passwordHash: String!
  }
`;

const Queries = gql`
  type Query {
    "Get all users from the database."
    users: [User]!
    "Get all notes from the database."
    notes: [Note]!
  }
`;

const Mutations = gql`
  type Mutation {
    "Add a new user with hashed password. ID is determined by the system."
    addUser(username: String, passwordHash: String): User
    "Add a new note with given content. ID, timestamp and approval are determined by the system."
    addNote(content: String): Note
  }
`;

// export all schemas here as one default export array
export default [Note, User, Queries, Mutations];
