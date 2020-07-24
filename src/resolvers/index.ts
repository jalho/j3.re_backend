import { NoteModel } from "../schema/Mongoose";
import { Note } from "../types";
import tg from "../utils/typeGuards"; // type guards

const resolvers = {
  Query: {
    notes: async (): Promise<Note[]> => {
      const searchResults = await NoteModel.find({});
      const finalResults: Array<Note> = [];
      
      // type guard all results to type `Note`
      searchResults.forEach(document => {
        if (tg.isNote(document)) {
          finalResults.push(document);
        }
      });
      return finalResults;
    }
  }
};

export default resolvers;
