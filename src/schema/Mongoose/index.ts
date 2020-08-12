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

const projectSchema = new mongoose.Schema({
  name: String,
  categories: [String],
  description: String,
  technologies: [String],
  startTime: String,
  repositories: [String]
});

interface UserDocument extends mongoose.Document {
  username: string;
  passwordHash: string;
}

interface ProjectDocument extends mongoose.Document {
  name: string;
  categories: string[];
  description: string;
  technologies: string[];
  startTime: string;
  repositories: string[];
}

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
export const NoteModel = mongoose.model("Note", noteSchema); // TODO: Use generics in NoteModel too, like in UserModel
export const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
