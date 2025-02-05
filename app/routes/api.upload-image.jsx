import { json } from '@remix-run/node';  
import { insertMongoData } from '../entry.server';
import shopify from "../shopify.server"; 

const allowedOrigin = "*"; // Change in production

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
        const { session } = await shopify.authenticate.admin(request);
        
        console.log(session)
        if (!session || !session.accessToken) {
            return json({ success: false, message: "Unauthorized" }, { status: 401, headers });
        }

        const shopifyAccessToken = session.accessToken;
        const shop = session.shop; 

        const jsonData = await request.json();
        console.log("Received Data:", jsonData);

        try {
            const result = await insertMongoData(jsonData);
            return json({ success: true, insertedId: result.insertedId,dataJsForm:jsonData }, { headers });
        } catch (dbError) {
            console.error("MongoDB Insertion Error:", dbError);
            return json({ success: false, message: "Database error" }, { status: 500, headers });
        }

    } catch (error) {
        console.error("Unexpected Error:", error);
        return json({ success: false, message: 'Unexpected server error' }, { status: 500, headers });
    }
}
