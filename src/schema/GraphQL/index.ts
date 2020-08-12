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
    approved: Boolean!
  }
`;

const User = gql`
  type User {
    "Unique ID generated to the user by MongoDB (database)."
    id: ID!
    username: String!
  }
`;

const AuthPayload = gql`
  type AuthPayload {
    token: String!
    user: User!
  }
`;

const Project = gql`
  type Project {
    id: ID!
    name: String!
    "Project's category, e. g. full stack"
    categories: [String]
    description: String
    "Technologies used in project, e. g. GraphQL"
    technologies: [String]
    "E. g. Summer 2020"
    startTime: String
    "URLs to e. g. GitHub repositories relevant to the project"
    repositories: [String]
  }
`;

const Queries = gql`
  type Query {
    "Get all users from the database."
    users: [User]
    "Get all approved notes from the database."
    approvedNotes: [Note]
    "Get one user with matching username."
    oneUser(username: String!): User
    "Get all projects."
    projects: [Project]
  }
`;

const Mutations = gql`
  type Mutation {
    "Authentication required, otherwise return null."
    addUser(username: String!, password: String!): User
    "Authentication required, otherwise return null."
    addNote(content: String!): Note
    "Return authentication payload on correct credentials, otherwise null."
    login(username: String!, password: String!): AuthPayload
    "Authentication required, otherwise return null."
    addProject(
      name: String!,
      categories: [String],
      description: String,
      technologies: [String],
      startTime: String,
      repositories: [String]
    ): Project
  }
`;

// export all schemas here as one default export array
export default [Note, User, Queries, Mutations, AuthPayload, Project];
