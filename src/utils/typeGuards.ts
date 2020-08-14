/* eslint-disable no-prototype-builtins */

import { Note, User, Project } from "../types";

/**
 * Custom type guard for narrowing down an unknown type to string.
 * @param value to check for being a string
 */
const isString = (value: unknown): value is string => {
  return (value instanceof String || typeof value === "string");
};

/**
 * Custom type guard for narrowing down an unknown type to boolean.
 * @param value to check for being a boolean
 */
const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

/**
 * Type guard for narrowing type to Note.
 * @param value to check
 */
const isNote = (value: unknown): value is Note => {
  if (value === null) return false;
  const test = value as Note;

  // false if at least one of the properties is missing
  if (
    test.content === undefined
    || test.id === undefined
    || test.time === undefined
    || test.approved === undefined
  ) {
    return false;
  }

  // false if id, content or time is not string, or if approved is not a boolean
  if (
    !isString(test.id)
    || !isString(test.content)
    || !isString(test.time)
    || !isBoolean(test.approved)
  ) {
    return false;
  }

  return true;
};

/**
 * Type guard for narrowing type to User.
 * @param value to check
 */
const isUser = (value: unknown): value is User => {
  if (value === null) return false;
  const test = value as User;

  // false if at least one of the properties is missing
  if (!test.username || !test.id || !test.roles) return false;

  // false if ID or username is not a string
  if (!isString(test.id) || !isString(test.username)) return false;

  return true;
};

const isProject = (value: unknown): value is Project => {
  if (!value) return false;
  const test = value as Project;
  if (!test.id || !test.name) return false; // required fields must exist...
  if (!isString(test.id) || !isString(test.name)) return false; // ...and be strings
  /* Note: In current implementation other fields' types are not checked in any way.
  For now it is fine though, as at least the required fields are checked to exist. */
  return true;
};

// default export all type guards
export default {
  isString,
  isNote,
  isUser,
  isProject
};
