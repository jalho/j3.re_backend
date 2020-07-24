/* eslint-disable no-prototype-builtins */

import { Note } from "../types";

/**
 * Type guard for narrowing type to string.
 * @param value to check
 */
const isString = (value: unknown): value is string => {
  return (value instanceof String || typeof value === "string");
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
  ) {
    return false;
  }

  // false if at least one of the properties is not string
  if (
    !isString(test.id)
    || !isString(test.content)
    || !isString(test.time)
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
