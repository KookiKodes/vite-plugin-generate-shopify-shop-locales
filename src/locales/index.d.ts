declare module 'vite-plugin-generate-shopify-shop-locales/locales' {
  export type Locale = {
    languageCode: string;
    countryCode: string;
  };
  const shopLocales: {
    defaultLocale: Locale;
    availableLocales: string[];
  };

  export default shopLocales;
}
