# j3.re

Full stack web app, personal website. Frontend and backend source is under [`packages/`](packages/).

## Hosting

Backend is deployed on Heroku and frontend on Vercel.

Backend's package is declared at root because Heroku requires that. Frontend's package is declared more consistently in its own subdirectory because Vercel is more flexible in that regard.

Heroku app with free plan goes to sleep after 30 minutes of inactivity. It wakes up automatically upon any received traffic.

## Required environment variables

Environment variables are excluded from version control. They must be added manually to the environment.

Create a `.env` file in the root directory of the project with content of shape:

    KEY1=VALUE1
    KEY2=VALUE2

### Backend

| required for | key | value |
|-|-|-|
| dev & prod | `MONGODB_URI` | `mongodb+srv://<username>:<password>@j3re.ytr5p.mongodb.net/<database name>?retryWrites=true&w=majority` |
| dev only | `PORT` | `4000` *(Generated internally in Heroku.)* |
| dev & prod | `JWT_SECRET` | *any string* |

Get credentials from [MongoDB dashboard](https://cloud.mongodb.com/):

* `<username>` is *j3reAdmin*

* `<password>` can be obtained from the dashboard

* `<database name>` is *j3re*

### Frontend

| required for | key | value | note |
|-|-|-|-|
| prod only | `REACT_APP_BACKEND_URI` | `https://j3re-backend.herokuapp.com/` | can change |
| prod only | `REACT_APP_BACKEND_WSURI` | `wss://j3re-backend.herokuapp.com/graphql` | `wss://` with HTTPS |

## Backend source structure

<details>
    <summary>Expand</summary>

*as of 27 August 2020*
```
src
¦   index.ts                # entry point
¦   
+---resolvers
¦       index.ts            # resolvers for GraphQL operations
¦       
+---schema                  # define data's shape in different implementations
¦   +---GraphQL
¦   ¦       index.ts        # GraphQL type definitions
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

## Frontend source structure

<details>
    <summary>Expand</summary>

*as of 27 August 2020*
```
client/src
¦   App.tsx                             # single page app's base
¦   AppLoader.tsx                       # load "App", and meanwhile render "Landing" as fallback
¦   i18n.ts                             # internationalization of the UI
¦   index.tsx                           # entry point
¦   react-app-env.d.ts                  # Create React App (CRA) types
¦   
+---components                          # components and their styles:
¦   ¦   ...                             # most of them in this shared directory...
¦   ¦ 
¦   +---Card                            # ...except the most recent one was created in its own dir
¦           ...
¦       
+---resources               
¦       translations.ts                 # UI texts in available languages
¦       
+---state                               # Redux utility
¦   ¦   actionCreators.ts               # dispatchable actions
¦   ¦   rootReducer.ts                  # combined reducers
¦   ¦   store.ts                        # Redux store
¦   ¦   
¦   +---reducers                        # reducers to be combined in rootReducer
¦           ...
¦       
+---styles
¦       main.scss                       # the main Sass file
¦       _constants.scss                 # variables used across stylesheets
¦       _mixins.scss                    # mixins used across stylesheets
¦       
+---types
¦       index.d.ts                      # own types
¦   
+---utils
¦       graphql.ts                      # query documents for GraphQL operations
¦       helpers.ts                      # miscellaneous helper functions
¦       typeguards.ts                   # custom type guards for TypeScript
¦       
+---views                               # modules for different views in the UI
    +---check_my_ip
    ¦       ...
    ¦       
    +---content_management              # render only if authorized as admin
    ¦       ...
    ¦     
    +---cv
    ¦       ...
    ¦       
    +---easter_egg                      # accessible via a hidden button
    ¦       ...
    ¦    
    +---home                            # rendered after "landing"
    ¦       ...
    ¦       
    +---landing                         # rendered first (for minimum time and as fallback)
    ¦       ...
    ¦       
    +---leave_note
    ¦       ...
    ¦       
    +---login
    ¦       ...
    ¦       
    +---portfolio
            ...
```
</details>

## Progress snapshots

[Video demo on YouTube as of commit `49b778c`](https://youtu.be/ez-e5bLRhnQ) (27 August 2020)