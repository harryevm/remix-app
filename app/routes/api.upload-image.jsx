import { json } from '@remix-run/node';
import shopify from '../shopify.server';



export async function loader({ request }) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS, PUT',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}

export async function action({ request }) {
    const headers = {
        'Access-Control-Allow-Origin': '*',  // For testing. Change to your Shopify domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    try {
        const { filename, mimeType, shop } = await request.json(); // Ensure you pass the 'shop' parameter

        // Load session from Shopify session storage
        const session = await shopify.sessionStorage.loadSession(shop);
        if (!session) {
            throw new Error("Session not found");
        }

        

        // GraphQL Mutation
        const mutation = `
        mutation GenerateUploadUrl($files: [StagedUploadInput!]!) {
            stagedUploadsCreate(input: $files) {
            stagedTargets {
                url
                resourceUrl
            }
            }
        }
        `;

        const variables = {
        files: [
            {
            filename,
            mimeType,
            resource: "FILE",
            },
        ],
        };

        // Use the correct Shopify GraphQL client
        const client = new shopify.clients.GraphQL({ session });

        // Send GraphQL Request
        const response = await client.query({ data: { query: mutation, variables } });

        if (!response.body || !response.body.data) {
            throw new Error("Invalid response from Shopify API");
        }
        
        // Extract the Upload URL from Response
        const uploadUrl = response.body.data.stagedUploadsCreate.stagedTargets[0].url;

        return json({ success: true, uploadUrl }, { headers });

    } catch (error) {
        console.error("Error getting upload URL:", error);
        return json({ success: false, message: error.message || "Error getting upload URL" }, { status: 500, headers });
    }
}
