import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./locale/en";
import * as no from "./locale/no";
i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: {
        translation: en,
      },
      no: {
        translation: no,
      },
    },
  });
