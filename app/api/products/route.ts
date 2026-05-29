import {NextResponse} from 'next/server';
import {authenticateAdmin} from '@/lib/auth/authenticate-admin';

export async function GET(request: Request) {
  try {
    const {client} = await authenticateAdmin(request);

    const response = await client.request(`{
      products(first: 10) {
        edges {
          node {
            id
            title
          }
        }
      }
    }`);

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({error: 'Internal error'}, {status: 500});
  }
}
