import React from "react";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";
import Face from "../../components/Face";

const Landing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="view">
      <Header text="j3.re" />
      <div id="landingFace"><Face /></div>
      <em id="landingSubText">{t("Work in progress.")}</em>
    </div>
  );
};

export default Landing;
