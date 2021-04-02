```
v1.0 (28 Aug 2020)
```

# About

Jere Alho, [@jalho](https://github.com/jalho) on GitHub

This is the source of my personal website's **frontend** to be served at [j3.re](http://j3.re/).

The project's GraphQL **backend** can be found in its own repository at [jalho/j3.re_backend](https://github.com/jalho/j3.re_backend).

The project also serves as Full Stack Open 2020 ([MOOC](https://fullstackopen.com/) by University of Helsinki) personal final project. For that reason a working hours' tracking document is included in the repository under [temp/school](https://github.com/jalho/j3.re/blob/master/temp/school/Työaikakirjanpito.md).

## Required environment variables

<details>
<summary>Expand</summary>

Environment variables are excluded from version control by convention. They must be added manually to the environment.

Create a `.env` file in the root directory of the client with content of shape:

    REACT_APP_KEY1=VALUE1
    REACT_APP_KEY2=VALUE2

> [Note:](https://create-react-app.dev/docs/adding-custom-environment-variables/) You must create custom environment variables beginning with `REACT_APP_`.

| required for | key | value | note |
|-|-|-|-|
| backend use | `REACT_APP_BACKEND_URI` | `https://j3re-backend.herokuapp.com/` | can change |
| backend Web Socket use | `REACT_APP_BACKEND_WSURI` | `wss://j3re-backend.herokuapp.com/graphql` | `wss://` with HTTPS |
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

## Project tech stack (planned)

<details>
<summary>Expand</summary>

| *tech* | *utility* | *docs* | *implemented* |
|--|--|--|--|
|||||
| **React** |
|||||
| Create React App | bootstrapping | [create-react-app.dev](https://create-react-app.dev/docs/getting-started) | ✔️ |
| React Redux | state management | [react-redux.js.org](https://react-redux.js.org/) | ✔️ |
| React Bootstrap | component library  |[react-bootstrap.github.io](https://react-bootstrap.github.io/) | ✔️ |
| React Router | app routing | [reactrouter.com](https://reactrouter.com/web/guides/quick-start) | ✔️ |
| React i18next | internationalization | [react.i18next.com](https://react.i18next.com/guides/quick-start) | ✔️ |
| React Icons | icons | [react-icons.github.io](https://react-icons.github.io/react-icons/) | ✔️ |
|||||
| **database** ||||
|||||
| GraphQL | data query language | see *Apollo* | ✔️ |
| Apollo | GraphQL implementation | [apollographql.com](https://www.apollographql.com/docs/) | ✔️ |
| MongoDB | database | [docs.mongodb.com](https://docs.mongodb.com/) | ✔️ |
| mongoose | MongoDB implementation | [mongoosejs.com](https://mongoosejs.com/docs/) | ✔️ |
|||||
| **miscellaneous** ||||
|||||
| Sass | style preprocessor | [sass-lang.com](https://sass-lang.com/documentation) | ✔️ |
| TypeScript | main programming language | [typescriptlang.org](https://www.typescriptlang.org/docs/home.html) | ✔️ |
| Node.js | runtime environment | [nodejs.org](https://nodejs.org/en/docs/) | ✔️ |
|||||
| **deployment** ||||
|||||
| Vercel | hosting frontend | [vercel.com](https://vercel.com/docs) | ✔️ |
| Heroku | hosting backend | [devcenter.heroku.com](https://devcenter.heroku.com/) | ✔️ |
| EuroDNS | domain name registrar | [eurodns.com](https://www.eurodns.com/) | ✔️ |

---
</details>

## Progress snapshots

#### Video demos on YouTube, starting from latest.

 1. [as of commit `49b778c`](https://youtu.be/ez-e5bLRhnQ) - 27 August 2020 **[latest]**
 2. [as of commit `211533e`](https://youtu.be/476SoWuWQ_o) - 20 August 2020
 3. [as of commit `968cf10`](https://youtu.be/XYn0gqTw7MI) - 11 August 2020
 4. [as of commit `407f3ad`](https://youtu.be/r0ZoqIL1H2g) - 21 July 2020
 5. [as of commit `02d9156`](https://youtu.be/w4ucXlW8Zhg) - 16 July 2020
