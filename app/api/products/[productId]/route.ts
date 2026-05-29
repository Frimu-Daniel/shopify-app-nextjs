import {NextResponse} from 'next/server';
import {authenticateAdmin} from '@/lib/auth/authenticate-admin';

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const {productId} = await context.params;

  if (!/^\d+$/.test(productId)) {
    return NextResponse.json({error: 'Invalid product ID.'}, {status: 400});
  }

  try {
    const {client} = await authenticateAdmin(request);
    const gid = `gid://shopify/Product/${productId}`;

    const response = await client.request(
      `#graphql
        query ProductById($id: ID!) {
          product(id: $id) {
            id
            title
            description
            featuredImage {
              url
              altText
            }
          }
        }
      `,
      {
        variables: {id: gid},
      },
    );

    const product = response.data?.product;

    if (!product) {
      return NextResponse.json({error: 'Product not found.'}, {status: 404});
    }

    return NextResponse.json({product});
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error('[products/[productId]]', message, error);
    return NextResponse.json({error: message}, {status: 500});
  }
}
