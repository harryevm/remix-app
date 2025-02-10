import { json } from '@remix-run/node';  // JSON response
import { insertMongoData } from '../entry.server';
import shopify from '../shopify.server';
import fetch from 'node-fetch';

export async function loader({ request }) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}

export async function action({ request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Change in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'POST') {
        try {
            console.log(shopify);

            // Parse form data
            const formData = await request.formData();
            const title = formData.get('title');
            const email = formData.get('email');
            const password = formData.get('password');
            const file = formData.get('file'); // Expecting a file input

            if (!file) {
                return json({ success: false, message: 'No file uploaded' }, { status: 400, headers });
            }

            // Authenticate Shopify session
            const session = await shopify.authenticate.admin(request);
            if (!session) {
                return json({ success: false, message: 'Authentication failed' }, { status: 401, headers });
            }

            console.log('Session:', session);

            // Convert FormData to MongoDB document format
            const mongoData = {
                title,
                email,
                password,
                fileName: file.name,
                fileType: file.type,
                uploadedAt: new Date(),
            };

            // Insert data into MongoDB
            const result = await insertMongoData(mongoData);

            // Upload file to Shopify using GraphQL Files API
            const SHOPIFY_STORE = session.shop; // Store URL
            const ACCESS_TOKEN = session.accessToken; // Admin API Access Token

            const fileUploadResponse = await uploadFileToShopify(SHOPIFY_STORE, ACCESS_TOKEN, file);
            console.log('Shopify File Upload Response:', fileUploadResponse);

            return json({ success: true, insertedId: result.insertedId, fileUploadResponse }, { headers });

        } catch (error) {
            console.error('Error:', error);
            return json({ success: false, message: 'Error processing request' }, { status: 500, headers });
        }
    }
}

// Function to Upload File to Shopify Files API
async function uploadFileToShopify(shop, accessToken, file) {
    const graphqlQuery = {
        query: `
            mutation fileCreate($files: [FileCreateInput!]!) {
                fileCreate(files: $files) {
                    files {
                        id
                        url
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `,
        variables: {
            files: [
                {
                    originalSource: file, // File input
                    contentType: file.type
                }
            ]
        }
    };

    const response = await fetch(`https://${shop}/admin/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify(graphqlQuery)
    });

    const responseData = await response.json();
    return responseData;
}
