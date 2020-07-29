/* Apparently `graphql` package doesn't come with resolver typings. One possible workaround could be
using https://github.com/ardatan/graphql-tools package or something similar. For now I don't see this
as a priority though, so I'll just disable missing typings warnings in eslint for this file where the
issue is relevant. */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcryptjs";

import { NoteModel, UserModel } from "../schema/Mongoose";
import { Note, User } from "../types";
import { asUser, asNote } from "../utils/helpers";

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
    oneUser: async (_parent: any, args: { username: string }): Promise<User|null> => {
      const searchResult = await UserModel.findOne({ username: args.username });
      const user = asUser(searchResult);
      return user;
    }
  },
  Mutation: {
    addNote: async (_parent: any, args: { content: string; }): Promise<Note|null> => {
      const savedDocument = await (new NoteModel({
        approved: false, // false by default; should be approved later
        content: args.content,
        time: new Date().toISOString()
      })).save();
      return asNote(savedDocument);
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
