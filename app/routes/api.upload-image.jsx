import { json } from '@remix-run/node';  
import { insertMongoData } from '../entry.server';

const allowedOrigin = "*"; // Change this in production to your Shopify domain

export async function loader({ request }) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
    return json({ success: false, message: 'Invalid request method' }, { status: 405 });
}

export async function action({ request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method !== "POST") {
        return json({ success: false, message: "Invalid request method" }, { status: 405, headers });
    }

    try {
        const jsonData = await request.json();
        console.log("Received Data:", jsonData);

        // Insert into MongoDB
        const result = await insertMongoData(jsonData);

        return json({ success: true, insertedId: result.insertedId }, { headers });

    } catch (error) {
        console.error("Error:", error);
        return json({ success: false, message: 'Server error' }, { status: 500, headers });
    }
}
