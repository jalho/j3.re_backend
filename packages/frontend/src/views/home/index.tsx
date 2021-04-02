import React from "react";
import { useTranslation } from "react-i18next";
import { DiGithubFull } from "react-icons/di";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div id="home">
      <p>
        {t("SITE_DESCRIPTION")}
      </p>
      <p>
        {t("CONTACT_THROUGH_GITHUB")}
        <br/>
        <a href="https://github.com/jalho">
          <DiGithubFull />
        </a>
      </p>
    </div>
  );
};

export default Home;
