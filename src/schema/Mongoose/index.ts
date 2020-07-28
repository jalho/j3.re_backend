import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: String,
  time: String,
  approved: Boolean
});

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String
});

export const NoteModel = mongoose.model("Note", noteSchema);
export const UserModel = mongoose.model("User", userSchema);
