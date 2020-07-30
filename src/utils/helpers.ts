import jwt from "jsonwebtoken";

import { EnvironmentVariables, User, Note } from "../types";
import tg from "./typeGuards";

/* TODO: Consider an alternative implementation; really what is happening here is just
that environment variables are made sure to exist in `process.env`. Therefore they could
be accessed from there instead of having to return anything from this function. */
/**
 * Get server port number and database connection URI from environment.
 */
export const getEnvironmentVariables = (): EnvironmentVariables => {
  let port: number | undefined;
  let uri: string | undefined;
  let jwtSecret: string | undefined;

  const mode = process.env.NODE_ENV;

  /* In development mode load variables from local `.env` file to `process.env`.
  Alternatively, once deployed, variables are obtained from Heroku's system. */
  if (mode && mode === "development") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require("dotenv");
    dotenv.config();
  }

  const { PORT, MONGODB_URI, JWT_SECRET } = process.env;

  if (PORT) port = parseInt(PORT, 10); // convert to number
  if (MONGODB_URI) uri = MONGODB_URI;
  if (JWT_SECRET) jwtSecret = JWT_SECRET;
  
  // crash if missing something required
  if (!uri || !port || !jwtSecret) throw new Error("Environment variables missing!");

  return {
    PORT: port,
    MONGODB_URI: uri,
    JWT_SECRET: jwtSecret
  };
};

/**
 * Narrow an object to type User, or return null if it cannot be done.
 * @param value to narrow to User type
 */
export const asUser = (value: unknown): User|null => {
  const test = value as User;
  if (!tg.isUser(test)) return null;

  const resultingUser: User = {
    id: test.id,
    username: test.username
  };

  return resultingUser;
};

/**
 * Narrow an object to type Note, or return null if it cannot be done.
 * @param value to narrow to Note type
 */
export const asNote = (value: unknown): Note|null => {
  const test = value as Note;
  if (!tg.isNote(test)) return null;

  const resultingNote: Note = {
    approved: test.approved,
    content: test.content,
    id: test.id,
    time: test.time
  };

  return resultingNote;
};

/**
 * Decode authorized (logged in) user information from token received in
 * the authorization header of an HTTP request. Return null if no user
 * could be decoded.
 */
export const decodeToken = (token: string): User|null => {
  const { JWT_SECRET } = getEnvironmentVariables();
  const decodedInformation = jwt.verify(token, JWT_SECRET);
  return asUser(decodedInformation);
};
