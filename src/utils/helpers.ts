import { EnvironmentVariables } from "../types";

/**
 * Get server port number and database connection URI from environment.
 */
export const getEnvironmentVariables = (): EnvironmentVariables => {
  let port: number | undefined;
  let uri: string | undefined;

  const mode = process.env.NODE_ENV;

  /* In development mode load variables from local `.env` file to `process.env`.
  Alternatively, once deployed, variables are obtained from Heroku's system. */
  if (mode && mode === "development") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require("dotenv");
    dotenv.config();
  }

  const { PORT, MONGODB_URI } = process.env;

  if (PORT) port = parseInt(PORT, 10); // convert to number
  if (MONGODB_URI) uri = MONGODB_URI;
  
  // crash if missing something required
  if (!uri || !port) throw new Error("Environment variables missing!");

  return {
    PORT: port,
    MONGODB_URI: uri
  };
};
