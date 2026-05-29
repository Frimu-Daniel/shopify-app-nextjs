import {getShopify} from '../shopify';
import {authenticateRequest} from './token-exchange';

export async function authenticateAdmin(request: Request) {
  const session = await authenticateRequest(request);
  const client = new (getShopify().clients.Graphql)({session});

  return {session, client};
}
