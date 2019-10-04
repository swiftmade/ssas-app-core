import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import en from "./locales/en";
import la from "./locales/la";
import uk from "./locales/uk";

I18n.defaultLocale = "en";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageCode;
}

I18n.translations = {
  en,
  la,
  uk
};

export default I18n;
