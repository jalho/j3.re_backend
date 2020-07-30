export interface Note {
  id: string!;
  content: string!;
  time: string!;
  approved: boolean!;
}

export interface User {
  id: string!;
  username: string!;
}

export interface AuthPayload {
  token: string;
  user: User;
}

/**
 * Required environment variables for running the server.
 */
export interface EnvironmentVariables {
  /**
   * Port number in which to start the server at. Determined by Heroku once deployed.
   * Otherwise should be set to 4000 by Apollo convention.
   */
  PORT: number!;
  /**
   * Secret URI obtained from MongoDB dashboard containing username, password and
   * database name.
   */
  MONGODB_URI: string!;
  /**
   * A secret string used in JSON Web Token signature.
   */
  JWT_SECRET: string!;
}
