# About

Jere Alho, [@jalho](https://github.com/jalho) on GitHub

This is the source of my personal website's GraphQL **backend**.

The project's **frontend** can be found at [jalho/j3.re_frontend](https://github.com/jalho/j3.re_frontend) with comprehensive project documentation.

## Scripts

<details>
<summary>Expand</summary>

* `npm start dev`

    *Run `src/index.ts` in continuous watch & restart mode using nodemon and ts-node. This is the only script needed in development.*

* `npm start`

    *Run `build/index.js` (compiled from TypeScript) with Node.js. Heroku web process is configured (in `Procfile`) to use this script. It does so automatically after running the build script first.*

* `npm run build`

    *Run `tsc`, i. e. compile TypeScript as configured in `tsconfig.js`. Output to `build` directory. Heroku uses this script automatically on deploy.*
</details>

## Required environment variables

<details>
<summary>Expand</summary>

(Secret) environment variables are excluded from version control. They must be added manually to the environment.

Create a `.env` file in the root directory of the project.

| required for | key | value |
|-|-|-|
| database access | `MONGODB_URI` | `mongodb+srv://<username>:<password>@j3re.ytr5p.mongodb.net/<database name>?retryWrites=true&w=majority` |
| starting development server | `PORT` | `4000` - **Omit from Heroku!** |

where the placeholders must be replaced with the information obtained from [MongoDB dashboard](https://cloud.mongodb.com/):

* `<username>` is *j3reAdmin* (can be changed)

* `<password>` can be obtained from the dashboard

* `<database name>` is *j3re* (can be changed)
</details>

## Backend source structure

<details>
    <summary>Expand</summary>

*as of 24 July 2020*
```
src
¦   index.ts                # entry point
¦   
+---resolvers
¦       index.ts            # resolvers for GraphQL operations
¦       
+---schema                  # define data's shape in different implementations
¦   +---GraphQL
¦   ¦       index.ts        # default export for GraphQL types
¦   ¦       NoteSchema.ts   # "Note" type for GraphQL
¦   ¦       
¦   +---Mongoose
¦           index.ts        # Mongoose schemas and models
¦           
+---types
¦       index.d.ts          # own types
¦       
+---utils
        helpers.ts          # miscellaneous helper functions
        typeGuards.ts       # custom type guards for TypeScript
```
</details>