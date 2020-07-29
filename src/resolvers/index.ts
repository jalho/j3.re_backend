// graphql doesn't come with resolver typings I guess TODO: Consider using https://github.com/ardatan/graphql-tools
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcryptjs";

import { NoteModel, UserModel } from "../schema/Mongoose";
import { Note, User } from "../types";
import { asUser } from "../utils/helpers";
import tg from "../utils/typeGuards";

const resolvers = {
  Query: {
    // TODO: Rewrite using "as_" utility function.
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
    users: async (): Promise<User[]|null> => {
      const searchResults = await UserModel.find({});
      const finalResults: Array<User> = [];
      searchResults.forEach(document => {
        const user = asUser(document);
        if (user) finalResults.push(user);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    oneUser: async (_parent: any, args: { username: string }): Promise<User|null> => {
      const searchResult = await UserModel.findOne({ username: args.username });
      const user = asUser(searchResult);
      return user;
    }
  },
  Mutation: {
    // TODO: Rewrite using "as_" utility function.
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
    addUser: async (_parent: any, args: { username: string; password: string }): Promise<User|null> => {
      const addedDocument = await new UserModel({
        username: args.username,
        passwordHash: bcrypt.hashSync(args.password, 10)
      }).save();
      return asUser(addedDocument);
    }
  }
};

export default resolvers;
