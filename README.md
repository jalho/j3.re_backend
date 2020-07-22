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

    *Run `build/index.js` compiled from TypeScript with Node. Heroku web process is configured to do the same in `Procfile` when the code is deployed. TODO: Change Procfile to use this script instead.*

* `npm run build`

    *Run `tsc`, i. e. compile TypeScript as configured in `tsconfig.js`. Heroku uses this script automatically on deploy.*
</details>

## Backend source structure

<details>
    <summary>Expand</summary>

*TODO!*
```
src
¦   ...
```
</details>