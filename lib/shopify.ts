import '@shopify/shopify-api/adapters/web-api';
import {shopifyApi, ApiVersion, type Shopify} from '@shopify/shopify-api';

let _shopify: Shopify | undefined;

export function getShopify(): Shopify {
  if (!_shopify) {
    _shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY!,
      apiSecretKey: process.env.SHOPIFY_API_SECRET!,
      scopes: process.env.SCOPES!.split(','),
      hostName: process.env.HOST!.replace(/https?:\/\//, ''),
      hostScheme: 'https',
      apiVersion: ApiVersion.January25,
      isEmbeddedApp: true,
    });
  }
  return _shopify;
}
