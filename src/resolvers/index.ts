import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { NoteModel, UserModel, ProjectModel } from "../schema/Mongoose";
import { Note, User, AuthPayload, Project } from "../types";
import { asUser, asNote, getEnvironmentVariables, asProject } from "../utils/helpers";

const resolvers = {
  /* TODO (question): Does it make sense to use narrowers like this ("asUser", "asProject" etc.) or is
  there a more elegant way to implement shared types between Apollo, MongoDB and Node.js code?
  Currently for example in queries the database is first queried for documents, the results are
  saved in a temporary array and that is looped through checking every item to be of the required
  type using custom type guards. Does this make any sense or is it reasonable and good convention?
  This could perhaps be simplified by using the same shared types when defining schemas for MongoDB,
  GraphQL and the TypeScript app itself. What's the proper way to do that? */
  Query: {
    /**
     * Get all notes from the database and return approved ones in an array, or return null
     * if none of the documents somehow were not of type Note.
     */
    approvedNotes: async (): Promise<Note[]|null> => {
      const searchResults = await NoteModel.find({});
      const finalResults: Array<Note> = [];
      searchResults.forEach(document => {
        const note = asNote(document);
        if (note && note.approved) finalResults.push(note);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    /**
     * Get all users from the database and return them in an array, or return null if none
     * of the documents somehow were not of type User.
     */
    users: async (): Promise<User[]|null> => {
      const searchResults = await UserModel.find({});
      const finalResults: Array<User> = [];
      searchResults.forEach(document => {
        const user = asUser(document);
        if (user) finalResults.push(user);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    /**
     * Find one user from the database and return it, or return null if the found document is
     * somehow not of type User.
     */
    oneUser: async (_parent: unknown, args: { username: string }): Promise<User|null> => {
      const searchResult = await UserModel.findOne({ username: args.username });
      const user = asUser(searchResult);
      return user;
    },
    projects: async (): Promise<Project[]|null> => {
      const searchResults = await ProjectModel.find({});
      const finalResults: Array<Project> = [];
      searchResults.forEach(document => {
        const project = asProject(document);
        if (project) finalResults.push(project);
      });
      return finalResults.length > 0 ? finalResults : null;
    }
  },
  Mutation: {
    /**
     * Attempt to save a new note to database. Return the saved note on success, or null if the
     * saved document is somehow not of type Note.
     */
    addNote: async (_parent: unknown, args: { content: string; }, context: { user: unknown }): Promise<Note|null> => {
      if (!context.user) return null;
      const savedDocument = await (new NoteModel({
        approved: false, // false by default; should be approved later
        content: args.content,
        time: new Date().toISOString()
      })).save();
      return asNote(savedDocument);
    },
    /**
     * Attempt to save a new user to database. Return the saved user on success, or null if the
     * saved document is somehow not of type User.
     */
    addUser: async (_parent: unknown, args: { username: string; password: string }, context: { user: unknown }): Promise<User|null> => {
      if (!context.user) return null;
      const addedDocument = await new UserModel({
        username: args.username,
        passwordHash: bcrypt.hashSync(args.password, 10)
      }).save();
      return asUser(addedDocument);
    },
    /* Login is mutation instead of query even though it has no side effects in this implementation.
    Good explanation of the convention can be found at https://stackoverflow.com/a/50190570/9654273. */
    /**
     * Return a JSON web token for correct credentials, or null for incorrect.
     */
    login: async (_parent: unknown, args: { username: string; password: string }): Promise<AuthPayload|null> => {
      const userDocument = await UserModel.findOne({ username: args.username });
      if (!userDocument) return null;
      if (bcrypt.compareSync(args.password, userDocument.passwordHash)) {
        const user = asUser(userDocument);
        if (!user) return null;
        const { JWT_SECRET } = getEnvironmentVariables();
        const token = jwt.sign(user, JWT_SECRET);
        return {
          token,
          user
        };
      } else {
        return null;
      }
    },
    addProject: async (
      _parent: unknown,
      args: { name: string, categories?: string[], description?: string, technologies?: string[], startTime?: string, repositories?: string[] },
      context: { user: unknown }
    ): Promise<Project|null> => {
      // return null if not authorized
      if (!context.user) return null;
      // take name from args
      const objectToSave: Omit<Project, "id"> = { name: args.name };
      // take the rest of the fields in args, if there's any
      if (args.categories) objectToSave.categories = args.categories;
      if (args.description) objectToSave.description = args.description;
      if (args.technologies) objectToSave.technologies = args.technologies;
      if (args.startTime) objectToSave.startTime = args.startTime;
      if (args.repositories) objectToSave.repositories = args.repositories;
      // save the document to database
      const savedDocument = await (new ProjectModel(objectToSave)).save();
      // return the saved document as narrowed down to own type "Project"
      return asProject(savedDocument);
    }
  }
};

export default resolvers;
