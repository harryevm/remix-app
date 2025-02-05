import { json } from '@remix-run/node';  
import { insertMongoData } from '../entry.server';
import formidable from 'formidable';
const SHOPIFY_ACCESS_TOKEN = "shpua_29d15538abed3b88f2afb761fbbcc57a";  // Replace with your actual token
const SHOPIFY_STORE = "https://trevorf-testing.myshopify.com/";
import fs from 'fs';

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

    // Only allow POST requests
    if (request.method !== "POST") {
        return json({ success: false, message: "Invalid request method" }, { status: 405, headers });
    }

    try {
        // Create a new formidable form handler
        const form = new formidable.IncomingForm();

        // Parse the form data
        form.parse(request, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return json({ success: false, message: 'Error parsing form data' }, { status: 400, headers });
            }

            console.log("Received Fields:", fields);  // Regular form fields
            console.log("Received Files:", files);    // File data

            // Example of accessing the file
            const file = files.file[0];  // Assuming the file is uploaded under the name 'file'
            console.log("Uploaded file:", file);

            // Insert the form data (including file info) into MongoDB
            const result = await insertMongoData({ ...fields, fileUrl: file.filepath });

            return json({ success: true, insertedId: result.insertedId }, { headers });
        });
    } catch (error) {
        console.error("Server error:", error);
        return json({ success: false, message: 'Server error' }, { status: 500, headers });
    }
}