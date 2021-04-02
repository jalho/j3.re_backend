import { lazy } from "react";

/**
 * The minimum time in milliseconds until 'Landing' view is exited.
 */
const minimumDelay = 2500;

/**
 * Loads App after the set minimum delay.
 */
const AppLoader = lazy(
  /* "React.lazy takes a function that must call a dynamic import().
  This must return a Promise which resolves to a module with a
  default export containing a React component." */
  
  async () => {
    // bundle promises; import home page & arbitrary minimum delay
    const resolvedResults = await Promise.all([
      // two promises; one for dynamic import and another for arbitrary delay
      import("./App"), // --> Module (exports `App: React.FC`)
      new Promise((resolve) => setTimeout(resolve, minimumDelay)) // --> `undefined`
    ]);
    return resolvedResults[0];
  }

);

export default AppLoader;
