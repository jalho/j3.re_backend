# About

Jere Alho, [@jalho](https://github.com/jalho) on GitHub

This is the source of my personal website to be served at [j3.re](http://j3.re/).

The project also serves as Full Stack Open 2020 ([MOOC](https://fullstackopen.com/) by University of Helsinki) personal final project. For that reason a working hours' tracking document is included in the repository under [temp/school](https://github.com/jalho/j3.re/blob/master/temp/school/Työaikakirjanpito.md).

## Scripts

<details>
<summary>client</summary>

*All the usual CRA scripts. Documentation here: [create-react-app.dev/docs](https://create-react-app.dev/docs/available-scripts/#npm-start).*
* `npm start`

    *See the documentation above.*
</details>

<details>
<summary>server</summary>

* `npm start`
    
    *Run `dist/index.js` with Node, i. e. the TypeScript source compiled.*

* `npm run build`

    *Run `tsc`, i. e. compile TypeScript and output the compiled source to directory `dist`.*

* `npm run dev`

    *Run the server app in continuous watch & restart mode using nodemon and ts-node.*
</details>

## Project structure

<details>
    <summary>client</summary>

*as of 21 July 2020*
```
j3.re/client/src
¦   App.tsx                 # single page app's base
¦   AppLoader.tsx           # load "App", and meanwhile render "Landing" as fallback
¦   i18n.ts                 # internationalization of the UI
¦   index.tsx               # entry point
¦   react-app-env.d.ts      # CRA types
¦   
+---components              # components and their styles
¦       ...
¦       
+---resources               
¦       translations.ts     # UI texts in available languages
¦       
+---state                   # Redux utility
¦       actionCreators.ts   # dispatchable actions
¦       rootReducer.ts      # combined reducers
¦       store.ts            # Redux store
¦       
+---styles                  # main styles location
¦       main.scss           # the main Sass file
¦       _constants.scss     # variables used across stylesheets
¦       _mixins.scss        # mixins used across stylesheets
¦       
+---types                   # own types
¦       state.d.ts          # types for Redux implementation
¦       
+---views                   # modules for different views in the UI
    +---cv                  # "CV" view and its styles
    ¦       ...
    ¦       
    +---home                # "Home" view, rendered after "Landing"
    ¦       ...
    ¦       
    +---landing             # "Landing" view and its styles
    ¦       ...             # (shown fixed minimum time and as `Suspense` fallback if needed)
    ¦       
    +---portfolio           # "Portfolio" view
            ...
```
</details>

<details>
    <summary>server</summary>

*TODO!*
```
j3.re/server/src
¦   ...
```
</details>

## Tech stack (planned)

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
| **miscellaneous** ||||
|||||
| Sass | style preprocessor | [sass-lang.com](https://sass-lang.com/documentation) | ✔️ |
| GraphQL | data query language | see *Apollo* | ❌ |
| Apollo | GraphQL implementation | [apollographql.com](https://www.apollographql.com/docs/) | ❌ |
| Express.js | back end framework | [expressjs.com](https://expressjs.com/en/4x/api.html) | ❌ |
| TypeScript | main programming language | [typescriptlang.org](https://www.typescriptlang.org/docs/home.html) | ✔️ |
|||||
| **deployment** ||||
|||||
| Buddy | CI/CD | [buddy.works](https://buddy.works/docs) | ❌ |
| Vercel | hosting | [vercel.com](https://vercel.com/docs) | ✔️ |
| EuroDNS | domain name registrar | [eurodns.com](https://www.eurodns.com/) | ✔️ |

---
</details>

## Progress snapshots

#### Video demos on YouTube, starting from latest.

 1. [as of commit 407f3ad](https://youtu.be/r0ZoqIL1H2g) - uploaded 21 July 2020 **[latest]**
 2. [as of commit 02d9156](https://youtu.be/w4ucXlW8Zhg) - uploaded 16 July 2020