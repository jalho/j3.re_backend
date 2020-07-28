// graphql doesn't come with resolver typings I guess TODO: Consider using https://github.com/ardatan/graphql-tools
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoteModel, UserModel } from "../schema/Mongoose";
import { Note, User } from "../types";
import tg from "../utils/typeGuards"; // type guards

const resolvers = {
  Query: {
    notes: async (): Promise<Note[]> => {
      const searchResults = await NoteModel.find({});
      const finalResults: Array<Note> = [];
      // type guard all results to type `Note`
      searchResults.forEach(document => {
        if (tg.isNote(document) && document.approved) {
          finalResults.push(document);
        }
      });
      return finalResults;
    },
    users: async (): Promise<User[]> => {
      const searchResults = await UserModel.find({});
      const finalResults: Array<User> = [];
      searchResults.forEach(document => {
        if (tg.isUser(document)) finalResults.push(document);
      });
      return finalResults;
    },
    oneUser: async (_parent: any, args: { username: string }): Promise<User|null> => {
      const searchResult = await UserModel.findOne({ username: args.username });
      if (!searchResult) return null;
      if (tg.isUser(searchResult)) return searchResult;
      else return null;
    }
  },
  Mutation: {
    addNote: async (_parent: any, args: { content: string; }): Promise<Note> => {
      const savedNote = await (new NoteModel({
        approved: Math.random() >= 0.5, // TODO: Set as false by default.
        content: args.content,
        time: new Date().toISOString()
      })).save();
      if (tg.isNote(savedNote)) {
        return savedNote;
      } else {
        throw new Error("The note couldn't be saved correctly!");
      }
    },
    addUser: async (_parent: any, args: { username: string; passwordHash: string }): Promise<User> => {
      const savedUser = await (new UserModel({
        username: args.username,
        passwordHash: args.passwordHash
      })).save();
      if (tg.isUser(savedUser)) return savedUser;
      else throw new Error("The user couldn't be saved correctly!");
    }
  }
};

export default resolvers;
