// external imports
import React, { FormEvent, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

// own imports
import { LOGIN } from "../../utils/graphql";
import { setAuthentication } from "../../state/actionCreators";
import { StateCombinedFromReducers } from "../../types";
import { clearAuthInformation, notify } from "../../utils/helpers";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { t } = useTranslation();

  // GraphQL operations
  const [login, { data, loading }] = useMutation(LOGIN);

  // state management (Redux)
  const dispatch = useDispatch();
  const authentication = useSelector((state: StateCombinedFromReducers) => {
    return state.authenticationReducer.authentication;
  });

  /**
   * Clear the login form's input fields.
   */
  const clearFields = (): void => {
    setUsername("");
    setPassword("");
  };

  /**
   * Send a token request as mutation to GraphQL backend and clear input fields.
   * @param e event emitted from login form
   */
  const loginHandler = (e: FormEvent): void => {
    e.preventDefault(); // prevent reloading
    login({ variables: { username: username, password: password } })
      .catch(() => notify(t("Server is not operational."), 6000, "danger"));
    clearFields();
  };

  // save received token to local storage
  useEffect(() => {
    if (data && data.login) {
      dispatch(setAuthentication(data.login));
      localStorage.setItem("authentication", JSON.stringify(data.login));
      notify(t("Logged in as ") + data.login.user.username);
    }
  }, [data, dispatch, t]);

  /* indicate server status in case loading takes longer than given time
  (Heroku Free sleeps after 30 minutes of inactivity) */
  useEffect(
    () => {
      const timerID = setTimeout(
        () => {
          if (loading) notify(t("Waking up server..."), 6000);
        }, 1000
      );
      return (): void => clearTimeout(timerID);
    }, [loading, t]
  );

  // login mutation returns `null` for incorrect credentials instead of e. g. AuthenticationError
  useEffect(
    () => {
      if (data && !data.login) notify(t("Wrong credentials."), 3000, "danger");
    }, [data, t]
  );

  // render either login form or login info & logout button
  if (authentication) {
    return (
      <>
        <p id="loginInformation">
          <span>{t("Currently logged in as")}</span>
          <span id="loggedInUsername">{authentication.user.username}</span>
        </p>
        <Button onClick={(): void => {
          clearAuthInformation();
          notify(t("Logged out"));
        }}>
          Log out
        </Button>
      </>
    );
  } else return (
    <>
      <Form onSubmit={loginHandler}>
        <Form.Group>
          <Form.Label>{t("Username")}</Form.Label>
          <Form.Control type="text" onChange={(e): void => setUsername(e.target.value)} value={username} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>{t("Password")}</Form.Label>
          <Form.Control type="password" onChange={(e): void => setPassword(e.target.value)} value={password} />
        </Form.Group>

        <Button variant="primary" type="submit">
          {t("Log in")}
        </Button>
      </Form>
    </>
  );
};

export default Login;
