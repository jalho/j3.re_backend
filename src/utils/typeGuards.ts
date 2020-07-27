/* eslint-disable no-prototype-builtins */

import { Note } from "../types";

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

// default export all type guards
export default {
  isString,
  isNote
};
