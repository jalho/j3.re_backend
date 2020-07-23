/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoteModel } from "../schema/Mongoose";
import { Note } from "../types";

const isString = (value: any): value is string => {
  return typeof value === "string";
};

const isNote = (document: any): document is Note => {
  return (isString(document.id) && isString(document.content) && isString(document.time));
};

// TODO: Fix!
const resolvers = {
  Query: {
    notes: async (): Promise<Array<Note>> => {
      const notes: Array<Note> = [];
      const result = await NoteModel.find({});
      result.forEach(document => {
        console.log("DEBUG\ndocument:\n", document);
        if (isNote(document)) {
          console.log("DEBUG\nnote:\n", document);
          notes.push(document);
        }
      });
      return notes;
    }
  }
};

export default resolvers;
