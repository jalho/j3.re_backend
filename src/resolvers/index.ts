import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { NoteModel, UserModel } from "../schema/Mongoose";
import { Note, User } from "../types";
import { asUser, asNote, getEnvironmentVariables } from "../utils/helpers";

const resolvers = {
  Query: {
    approvedNotes: async (): Promise<Note[]|null> => {
      const searchResults = await NoteModel.find({});
      const finalResults: Array<Note> = [];
      searchResults.forEach(document => {
        const note = asNote(document);
        if (note && note.approved) finalResults.push(note);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    users: async (): Promise<User[]|null> => {
      const searchResults = await UserModel.find({});
      const finalResults: Array<User> = [];
      searchResults.forEach(document => {
        const user = asUser(document);
        if (user) finalResults.push(user);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    oneUser: async (_parent: unknown, args: { username: string }): Promise<User|null> => {
      const searchResult = await UserModel.findOne({ username: args.username });
      const user = asUser(searchResult);
      return user;
    }
  },
  Mutation: {
    addNote: async (_parent: unknown, args: { content: string; }): Promise<Note|null> => {
      const savedDocument = await (new NoteModel({
        approved: false, // false by default; should be approved later
        content: args.content,
        time: new Date().toISOString()
      })).save();
      return asNote(savedDocument);
    },
    addUser: async (_parent: unknown, args: { username: string; password: string }): Promise<User|null> => {
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
    login: async (_parent: unknown, args: { username: string; password: string }): Promise<string|null> => {
      const userDocument = await UserModel.findOne({ username: args.username });
      if (!userDocument) return null;
      if (bcrypt.compareSync(args.password, userDocument.passwordHash)) {
        const user = asUser(userDocument);
        if (!user) return null;
        const { JWT_SECRET } = getEnvironmentVariables();
        const token = jwt.sign(user, JWT_SECRET);
        return token;
      } else {
        return null;
      }
    }
  }
};

export default resolvers;
