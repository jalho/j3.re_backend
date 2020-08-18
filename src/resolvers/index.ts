import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

import { NoteModel, UserModel, ProjectModel } from "../schema/Mongoose";
import { Note, User, AuthPayload, Project, IPLookupPayload } from "../types";
import { asUser, asNote, getEnvironmentVariables, asProject, getAuthType } from "../utils/helpers";

const resolvers = {
  /* Question: Does it make sense to use narrowers like this ("asUser", "asProject" etc.) or is
  there a more elegant way to implement shared types between Apollo, MongoDB and Node.js code?
  Currently for example in queries the database is first queried for documents, the results are
  saved in a temporary array and that is looped through checking every item to be of the required
  type using custom type guards. Does this make any sense or is it reasonable and good convention?
  This could perhaps be simplified by using the same shared types when defining schemas for MongoDB,
  GraphQL and the TypeScript app itself. What's the proper way to do that? */
  Query: {
    /**
     * Get all notes from the database and return approved ones in an array, or return null
     * if none of the documents somehow were not of type Note.
     */
    approvedNotes: async (): Promise<Note[]|null> => {
      const searchResults = await NoteModel.find({});
      const finalResults: Array<Note> = [];
      searchResults.forEach(document => {
        const note = asNote(document);
        if (note && note.approved) finalResults.push(note);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    /**
     * Get all users from the database and return them in an array, or return null if none
     * of the documents somehow were not of type User.
     */
    users: async (): Promise<User[]|null> => {
      const searchResults = await UserModel.find({});
      const finalResults: Array<User> = [];
      searchResults.forEach(document => {
        const user = asUser(document);
        if (user) finalResults.push(user);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    /**
     * Find one user from the database and return it, or return null if the found document is
     * somehow not of type User.
     */
    oneUser: async (_parent: unknown, args: { username: string }): Promise<User|null> => {
      const searchResult = await UserModel.findOne({ username: args.username });
      const user = asUser(searchResult);
      return user;
    },
    projects: async (): Promise<Project[]|null> => {
      const searchResults = await ProjectModel.find({});
      const finalResults: Array<Project> = [];
      searchResults.forEach(document => {
        const project = asProject(document);
        if (project) finalResults.push(project);
      });
      return finalResults.length > 0 ? finalResults : null;
    },
    /**
     * Return the remote address saved in context, or null if there's none.
     */
    myIP: async (_parent: unknown, _args: unknown, context: { user?: User, remoteAddress?: string }): Promise<IPLookupPayload|null> => {
      if (context.remoteAddress) {
        const result: IPLookupPayload = {
          ip: context.remoteAddress
        };

        // try to get IP details from an API
        try {
          const { data: IP_lookup } = await axios.get(`http://ip-api.com/json/${context.remoteAddress}?fields=status,countryCode,city,isp,mobile,proxy`);
          // return only IP if further lookup fails
          if (IP_lookup.status === "fail") return result;
          else {
            result.city = IP_lookup.city;
            result.isp = IP_lookup.isp;
            result.mobile = IP_lookup.mobile;
            result.proxy = IP_lookup.proxy;
          }

          // try to get flag URL from another API
          try {
            const flagLookupResult = await axios.get(`https://restcountries.eu/rest/v2/alpha/${IP_lookup.countryCode}?fields=flag`);
            result.flagURL = flagLookupResult.data.flag;
          } catch (error) {
            // continue regardless of error; just omitting the flag URL
          }

        } catch (error) {
          // return only IP if further lookup fails
          return result;
        }

        return result; // return payload filled in with available fields
      }
      else return null;
    }
  },
  Mutation: {
    /**
     * Return null on wrong authorization or some other failure.
     */
    addNote: async (_parent: unknown, args: { content: string; }, context: { user: User }): Promise<Note|null> => {
      if (getAuthType(context) === "not authenticated") return null;
      const savedDocument = await (new NoteModel({
        approved: false, // false by default; should be approved later
        content: args.content,
        time: new Date().toISOString()
      })).save();
      return asNote(savedDocument);
    },
    /**
     * Return null on wrong authorization or some other failure.
     */
    addUser: async (_parent: unknown, args: { username: string; password: string, roles: string[] }, context: { user: User }): Promise<User|null> => {
      if (getAuthType(context) !== "admin") return null;
      const addedDocument = await new UserModel({
        username: args.username,
        passwordHash: bcrypt.hashSync(args.password, 10),
        roles: args.roles.length > 0 ? args.roles : ["user"]
      }).save();
      return asUser(addedDocument);
    },
    /* Login is mutation instead of query even though it has no side effects in this implementation.
    Good explanation of the convention can be found at https://stackoverflow.com/a/50190570/9654273. */
    /**
     * Return a JSON web token for correct credentials, or null for incorrect.
     */
    login: async (_parent: unknown, args: { username: string; password: string }): Promise<AuthPayload|null> => {
      const userDocument = await UserModel.findOne({ username: args.username });
      if (!userDocument) return null;
      if (bcrypt.compareSync(args.password, userDocument.passwordHash)) {
        const user = asUser(userDocument);
        if (!user) return null;
        const { JWT_SECRET } = getEnvironmentVariables();
        const token = jwt.sign(user, JWT_SECRET);
        return {
          token,
          user
        };
      } else {
        return null;
      }
    },
    addProject: async (
      _parent: unknown,
      args: {
        name: string,
        categories?: string[],
        description_en?: string,
        description_fi?: string,
        technologies?: string[],
        startTime?: string,
        repositories?: string[]
      },
      context: { user: User }
    ): Promise<Project|null> => {
      // return null if not authorized
      if (getAuthType(context) !== "admin") return null;
      // take name from args and initialize translated descriptions
      const objectToSave: Omit<Project, "id"> = { name: args.name, description: { en: "", fi: "" } };
      // take the rest of the fields in args, if there's any
      if (args.categories) objectToSave.categories = args.categories;
      if (args.description_en) objectToSave.description.en = args.description_en;
      if (args.description_fi) objectToSave.description.fi = args.description_fi;
      if (args.technologies) objectToSave.technologies = args.technologies;
      if (args.startTime) objectToSave.startTime = args.startTime;
      if (args.repositories) objectToSave.repositories = args.repositories;
      // save the document to database
      const savedDocument = await (new ProjectModel(objectToSave)).save();
      // return the saved document as narrowed down to own type "Project"
      return asProject(savedDocument);
    }
  }
};

export default resolvers;
