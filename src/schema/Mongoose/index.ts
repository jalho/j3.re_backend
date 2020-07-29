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

interface UserDocument extends mongoose.Document {
  username: string;
  passwordHash: string;
}

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
export const NoteModel = mongoose.model("Note", noteSchema); // TODO: Use generics in NoteModel too, like in UserModel
