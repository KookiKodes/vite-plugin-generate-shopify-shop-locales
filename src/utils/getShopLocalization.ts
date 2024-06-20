import fetch from 'node-fetch';

type Options = {
  shopDomain: string;
  apiVersion: string;
  accessToken: string;
};

const GetShopLocalization = `#graphql
    query GetShopLocalization {
      localization {
        availableCountries {
            isoCode
            availableLanguages {
              isoCode
            }
        }
      }
    }
`;

export type ShopLocalizationResult = {
  availableCountries: Array<{
    isoCode: string;
    availableLanguages: Array<{
      isoCode: string;
    }>;
  }>;
};

export async function getShopLocalization({
  shopDomain,
  apiVersion,
  accessToken,
}: Options) {
  const res = await fetch(
    `https://${shopDomain}/api/${apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: GetShopLocalization }),
    },
  );
  const jsonRes = (await res.json()) as any;
  if (jsonRes?.errors) throw jsonRes.errors;
  return jsonRes?.data?.localization as ShopLocalizationResult;
}
