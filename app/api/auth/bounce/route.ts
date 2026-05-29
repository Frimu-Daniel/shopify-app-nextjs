import {NextResponse} from 'next/server';

export async function GET() {
  const apiKey = process.env.SHOPIFY_API_KEY;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${apiKey}"></script>
      </head>
      <body>
        <script>
          shopify.idToken().then((token) => {
            const url = new URL(window.location.href);
            url.searchParams.delete('bounced');
            url.searchParams.set('id_token', token);
            open(url.toString(), '_top');
          });
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {'Content-Type': 'text/html'},
  });
}
