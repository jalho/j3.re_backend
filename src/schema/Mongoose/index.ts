import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: String,
  time: Date
});

export const NoteModel = mongoose.model("Note", noteSchema);
