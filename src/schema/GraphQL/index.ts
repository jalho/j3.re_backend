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
    roles: [String!]!
  }
`;

const AuthPayload = gql`
  type AuthPayload {
    token: String!
    user: User!
  }
`;

const Translations = gql`
  type Translations {
    en: String
    fi: String
  }
`;

const Project = gql`
  type Project {
    id: ID!
    name: String!
    "Project's category, e. g. full stack"
    categories: [String]
    "An object containing fields for the description in different languages."
    description: Translations
    "Technologies used in project, e. g. GraphQL"
    technologies: [String]
    "E. g. Summer 2020"
    startTime: String
    "URLs to e. g. GitHub repositories relevant to the project"
    repositories: [String]
    "Whether or not the project should be presented"
    visible: Boolean
  }
`;

const IPLookupPayload = gql`
  type IPLookupPayload {
    ip: String!
    city: String
    isp: String
    mobile: Boolean
    proxy: Boolean
    flagURL: String
  }
`;

const Queries = gql`
  type Query {
    "Get all users from the database."
    users: [User]
    "Get all approved notes from the database."
    approvedNotes: [Note]
    "Get all notes, including the ones not manually approved."
    allNotes: [Note]
    "Get one user with matching username."
    oneUser(username: String!): User
    "Get all projects."
    projects: [Project]
    "Get the address from which the request arrived."
    myIP: IPLookupPayload
  }
`;

const Mutations = gql`
  type Mutation {
    "Authentication required, otherwise return null. Default user role is user."
    addUser(username: String!, password: String!, roles: [String]): User
    "Authentication required, otherwise return null."
    addNote(content: String!): Note
    "Return authentication payload on correct credentials, otherwise null."
    login(username: String!, password: String!): AuthPayload
    "Authentication required, otherwise return null."
    addProject(
      name: String!,
      categories: [String],
      description_en: String,
      description_fi: String,
      technologies: [String],
      startTime: String,
      repositories: [String],
      visible: Boolean!
    ): Project
    "Authentication required, otherwise return null."
    toggleNoteApproval(id: String!): Note
    "Authentication required, otherwise return null."
    toggleProjectVisibility(id: String!): Project
    "Remove a note with given ID. Admin authorization required."
    removeNoteByID(id: String!): Note
    "Remove all notes and return deleted count. Intended for development use; not to be implemented in UI."
    removeAllNotes: Int
  }
`;

const Subscriptions = gql`
  type Subscription {
    noteApprovalChanged: Note!
    projectVisibilityChanged: Project!
    noteAdded: Note!
  }
`;

// export all schemas here as one default export array
export default [
  Note,
  User,
  AuthPayload,
  Project,
  Translations,
  IPLookupPayload,
  Queries,
  Mutations,
  Subscriptions
];
