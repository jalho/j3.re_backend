import React /*, { useState, useEffect } */ from "react";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { Project, Translations } from "../../types";
import Card from "../../components/Card";
import Header from "../../components/Header";
import { GET_ALL_PROJECTS } from "../../utils/graphql";

const Portfiolio: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data /*, loading */ } = useQuery(GET_ALL_PROJECTS);
  // const [ sleepMessage, setSleepMessage ] = useState<string>();

  /* TODO: Show loading indicator only if loading takes up at least say 700 ms.
  The commented out solution doesn't work for some reason. */
  
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (loading) setSleepMessage("The server seems to be sleeping. Waking it up, wait a second...");
  //   }, 700);
  // }, [loading]);

  /**
   * Choose the appropriate translation of the description based on
   * the selected language in `i18n`.
   * @param description object containing fields for the description in different languages
   */
  const getDescTranslation = (description: Translations): string => {
    switch (i18n.language) {
      case "en":
        return description.en;
      case "fi":
        return description.fi;
      default:
        return description.en;
    }
  };

  return (
    <div id="portfolio">
      {/* {sleepMessage && sleepMessage} */}
      {data && data.projects.map((project: Project, idx: number) => (
        <div key={idx} className="item">
          <Header text={project.name}/>
          <Card
            items={
              [
                project.description ?
                  <p><i>{getDescTranslation(project.description)}</i></p> :
                  <></>,
                project.startTime ?
                  <p>{t("Started in ") + t(project.startTime.split(" ")[0].toLowerCase()) + ` ${project.startTime.split(" ")[1]}.`}</p> :
                  <></>,
                project.technologies && project.technologies.length > 0 ?
                  <p>{t("Used technologies") + `: ${project.technologies.join(", ")}.`}</p> :
                  <>{" "}</>,
              ].concat(project.repositories && project.repositories.length > 0 ?
                  project.repositories.map((repo, idx) => <a href={repo} key={idx}>{"repository" + (idx > 0 ? ` ${idx + 1}` : "")}</a>) :
                  <></>
                )
            }
            infoText={project.categories ? project.categories.join(", ") : ""}
          />
        </div>
      ))}
    </div>
  );
};

export default Portfiolio;
