import { User, AuthPayload, Alert } from "../types";

const isString = (value: unknown): value is string => {
  if (!value) return false;
  return (value instanceof String || typeof value === "string");
};

const isUser = (value: unknown): value is User => {
  if (!value) return false;
  const test = value as User;
  if (test.id === undefined || test.username === undefined) {
    return false;
  }
  if (!isString(test.id) || !isString(test.username)) {
    return false;
  }
  return true;
};

const isAuthPayload = (value: unknown): value is AuthPayload => {
  if (!value) return false;
  const test = value as AuthPayload;
  if (test.token === undefined || test.user === undefined) return false;
  if (!isString(test.token)) return false;
  if (!isUser(test.user)) return false;
  return true;
};

const isAlert = (value: unknown): value is Alert => {
  if (!value) return false;
  const test = value as Alert;
  if (!isString(test.content) || !isString(test.variant)) return false;
  if (test.visible === undefined) return false;
  if (typeof test.visible !== "boolean") return false;
  return true;
};

export default {
  isString,
  isUser,
  isAuthPayload,
  isAlert
};
