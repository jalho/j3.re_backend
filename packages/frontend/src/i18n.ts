import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./resources/translations";

i18n
  .use(initReactI18next) // pass i18n to react-i18next
  .init({
    resources: translations,
    lng: localStorage.getItem("lng") || "en", // default language
    keySeparator: false, // e. g. "messages.welcome"
    interpolation: {
      escapeValue: false // XSS protection is already managed by React
    }
  });

export default i18n;
