import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import en from "./locales/en";
import lo from "./locales/lo";
import uk from "./locales/uk";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageCode;
}

I18n.defaultLocale = "en";
I18n.fallbacks = I18n.defaultLocale;

I18n.translations = {
  en,
  lo,
  uk
};

export default I18n;
