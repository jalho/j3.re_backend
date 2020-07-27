import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: String,
  time: String,
  approved: Boolean
});

export const NoteModel = mongoose.model("Note", noteSchema);
