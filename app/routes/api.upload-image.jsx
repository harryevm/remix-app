import { json } from '@remix-run/node';
import shopify from '../shopify.server';


export async function action({ request }) {
    try {
        const { filename, mimeType } = await request.json();

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
                    filename: filename,
                    mimeType: mimeType,
                    resource: "FILE",
                }
            ]
        };

        const client = new shopify.clients.GraphQL({ session: await shopify.auth.getSession() });

        const response = await client.query({ data: { query: mutation, variables } });

        const uploadUrl = response.body.data.stagedUploadsCreate.stagedTargets[0].url;

        return json({ success: true, uploadUrl });
    } catch (error) {
        console.error("Error getting upload URL:", error);
        return json({ success: false, message: "Error getting upload URL" }, { status: 500 });
    }
}
