import { lazy } from "react";

/* "React.lazy takes a function that must call a dynamic import().
This must return a Promise which resolves to a module with a
default export containing a React component." */
const App = lazy(
  
  async () => {
    // bundle promises; import home page & arbitrary minimum delay
    const resolvedResults = await Promise.all([
      // two promises; one for dynamic import and another for arbitrary delay
      import("./views/home"),
      new Promise((resolve) => setTimeout(resolve, 2500)) // --> `undefined`
    ]);
    return resolvedResults[0];
  }

);

export default App;
