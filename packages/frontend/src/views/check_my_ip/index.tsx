import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { GET_MY_IP } from "../../utils/graphql";
import Card from "../../components/Card";
import { IPLookupPayload } from "../../types";

const CheckMyIP: React.FC = () => {
  const { data, loading, error } = useQuery(GET_MY_IP);
  const { t } = useTranslation();
  const [ serverStatusMsg, setServerStatusMsg ] = useState<string>();
  
  /* indicate server status in case loading takes longer than given time
  (Heroku Free sleeps after 30 minutes of inactivity) */
  useEffect(
    () => {
      if (error) setServerStatusMsg(t("Server is not operational."));
      const timerID = setTimeout(
        () => {
          if (loading) setServerStatusMsg(t("The server seems to be sleeping. Wait a moment, waking it up..."));
        }, 1000
      );
      return (): void => clearTimeout(timerID);
    }, [loading, t, error]
  );

  let IPData: IPLookupPayload|undefined = undefined;
  if (data) IPData = data.myIP;

  return IPData
    ? (<div id="checkMyIP">
        {IPData &&
          <Card
            items={[
                <code key={2}>{IPData.ip}</code>,
                IPData.proxy ? <span>{t("proxy address")}</span> : <></>,
                IPData.mobile ? <span>{t("mobile address")}</span> : <></>,
                IPData.city && !IPData.mobile ? <span>{IPData.city}</span> : <></>,
                IPData.isp ? <span>{IPData.isp}</span> : <></>,
                IPData.flagURL ? <img src={IPData.flagURL} alt={"Flag of a country"} /> : <></>
            ]}
            infoText={t("IP address")}
          />
        }
      </div>)
    : <p id="checkMyIP">{serverStatusMsg}</p>;
};

export default CheckMyIP;
