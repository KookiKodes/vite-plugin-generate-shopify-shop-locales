import type { Plugin } from 'vite';
import { getStorefrontEnv } from './utils/env';
import {
  getShopLocalization,
  type ShopLocalizationResult,
} from './utils/getShopLocalization';
import { debugLog } from './utils/debugLog';

function buildShopLocales(localization: ShopLocalizationResult) {
  return localization.availableCountries.reduce(
    (locales: string[], country) => {
      return locales.concat(
        country.availableLanguages.map(
          (lang) => `${lang.isoCode}-${country.isoCode}`,
        ),
      );
    },
    [],
  );
}

type Locale = {
  languageCode: string;
  countryCode: string;
};

export type Options = {
  /**
   * The fallback locale to use if no other locale is found.
   *
   * @defaultValue `{ languageCode: 'EN', countryCode: 'US' }`
   */
  defaultLocale?: Locale;
  /**
   * Log various steps to aid in tracking down bugs.
   *
   * @defaultValue `false`
   */
  debug?: boolean;
};

export function GenerateShopifyShopLocales(options?: Options): Plugin {
  const {
    debug = false,
    defaultLocale = { languageCode: 'EN', countryCode: 'US' },
  } = options ?? { defaultLocale: { languageCode: 'EN', countryCode: 'US' } };

  const virtualModuleId = 'vite-plugin-generate-shopify-shop-locales/locales';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const log = (...args: unknown[]) => {
    if (!debug) return;
    debugLog(...args);
  };

  if (options) log('Plugin initialized with options:', options);

  let shopLocales: {
    defaultLocale: Locale;
    availableLocales: ReturnType<typeof buildShopLocales>;
  };

  return {
    name: 'generate-shopify-shop-locales',
    async buildStart() {
      const env = getStorefrontEnv.call(this);
      log('Fetching shop locales...');
      const localization = await getShopLocalization(env);
      log('Building shop locales');
      shopLocales = {
        defaultLocale: defaultLocale,
        availableLocales: buildShopLocales(localization),
      };
    },
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          const shopLocales = JSON.parse(\`${JSON.stringify(shopLocales)}\`);
          export default shopLocales;
        `;
      }
    },
  };
}

export default GenerateShopifyShopLocales;
