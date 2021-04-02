import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";

import NavigationBar from "./components/NavigationBar";
import { StateCombinedFromReducers } from "./types";
import { setAuthentication } from "./state/actionCreators";
import { notify } from "./utils/helpers";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const navbarVisible = useSelector((state: StateCombinedFromReducers) => {
    return state.navbarReducer.navbarVisible;
  });
  const appMode = useSelector((state: StateCombinedFromReducers) => {
    return state.appModeReducer.appMode;
  });
  const alert = useSelector((state: StateCombinedFromReducers) => {
    return state.alertReducer.alert;
  });

  // get authentication from localStorage on render, if there's any
  useEffect(() => {
    const authStringFromStorage = localStorage.getItem("authentication");
    const authentication = authStringFromStorage ? JSON.parse(authStringFromStorage) : null;
    if (authentication) {
      dispatch(setAuthentication(authentication));
      notify(t("Still logged in as ") + authentication.user.username);
    }
  }, [dispatch, t]);

  // import views dynamically ("code splitting")
  const Home = lazy(() => import("./views/home"));
  const CV = lazy(() => import("./views/cv"));
  const Portfolio = lazy(() => import("./views/portfolio"));
  const LeaveNote = lazy(() => import("./views/leave_note"));
  const Login = lazy(() => import("./views/login"));
  const EasterEgg = lazy(() => import("./views/easter_egg"));
  const ContentManagement = lazy(() => import("./views/content_management"));
  const CheckMyIP = lazy(() => import("./views/check_my_ip"));

  switch (appMode) {
    default:
    case "DEFAULT":
      return (
        <Suspense fallback={null} /* Prevent flashing the landing view as fallback here. */ >
          {navbarVisible && <NavigationBar />}
          <div className="view">
            {alert &&
              <Alert variant={alert.variant}>
                {alert.content}
              </Alert>
            }
            <Switch>
              <Route path="/cv" component={CV} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/leave-note" component={LeaveNote} />
              <Route path="/login" component={Login} />
              <Route path="/content-management" component={ContentManagement} />
              <Route path="/my-ip" component={CheckMyIP} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </Suspense>
      );
    case "EASTER_EGG":
      // prevent flashing the landing view as fallback here too
      return <Suspense fallback={null}><EasterEgg/></Suspense>;
  }


};

export default App;
