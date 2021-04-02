import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

// language selection icon
import { MdTranslate } from "react-icons/md";

// React Bootstrap components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";

// own
import { clearAuthInformation, notify } from "../utils/helpers";
import { StateCombinedFromReducers, Action } from "../types";
import { switchAppMode } from "../state/actionCreators";

const NavigationBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const authentication = useSelector((state: StateCombinedFromReducers) => {
    return state.authenticationReducer.authentication;
  });

  const eggClickCounter = useSelector((state: StateCombinedFromReducers) => {
    return state.appModeReducer.eggClickCounter;
  });

  const changeLanguage = (lng: string): void => {
    localStorage.setItem("lng", lng);
    i18n.changeLanguage(lng);
  };

  const emojis = ["🌌", "🌠", "⭐", "✨"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <div id="navbarContainer">
      <Navbar variant="dark" sticky="top">
        <Navbar.Brand as={Link} to="/">j3.re</Navbar.Brand>
    
        <Nav>
          <Nav.Link as={Link} to="/cv">{t("CV")}</Nav.Link>
          <Nav.Link as={Link} to="/portfolio">{t("Portfolio")}</Nav.Link>
          <NavDropdown title={randomEmoji} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={(): void => history.push("/leave-note")}>{t("Leave a note")}</NavDropdown.Item>
            <NavDropdown.Item onClick={(): void => history.push("/my-ip")}>{t("IP address")}</NavDropdown.Item>
            {authentication ?
              <NavDropdown.Item onClick={(): void => {clearAuthInformation(); notify(t("Logged out")); }}>{t("Log out")}</NavDropdown.Item> :
              <NavDropdown.Item onClick={(): void => history.push("/login")}>{t("Log in")}</NavDropdown.Item>
            }
            {eggClickCounter === 5 &&            
              <NavDropdown.Item onClick={(): Action => dispatch(switchAppMode("EASTER_EGG"))}>{t("Easter egg")}</NavDropdown.Item>
            }
            {authentication && authentication.user.roles.includes("admin") &&
              <NavDropdown.Item onClick={(): void => history.push("/content-management")}>{t("Content management")}</NavDropdown.Item>
            }
          </NavDropdown>
        </Nav>
      </Navbar>
      
      <Dropdown id="languageSelector">
        <Dropdown.Toggle as={Button} variant="outline-light">
          <MdTranslate />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={(): void => changeLanguage("en")} disabled={i18n.language === "en"}>
            {`${t("ENGLISH NATIVE")}${i18n.language === "en" ? ` (${t("current")})` : ""}`}
          </Dropdown.Item>
          <Dropdown.Item onClick={(): void => changeLanguage("fi")} disabled={i18n.language === "fi"}>
            {`${t("FINNISH NATIVE")}${i18n.language === "fi" ? ` (${t("current")})` : ""}`}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </div>
   );
};

export default NavigationBar;
