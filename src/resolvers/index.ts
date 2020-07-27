// graphql doesn't come with resolver typings I guess TODO: Consider using https://github.com/ardatan/graphql-tools
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoteModel } from "../schema/Mongoose";
import { Note } from "../types";
import tg from "../utils/typeGuards"; // type guards

const resolvers = {
  Query: {
    // TODO: Add a parameter for approval status and query only the approved from MongoDB!
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
        throw new Error("The note couldn't be correctly!");
      }
    }
  }
};

export default resolvers;
