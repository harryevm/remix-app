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
        const form = formidable({ 
            // You can set various options for the form
            uploadDir: './uploads',  // Temporary upload directory
            keepExtensions: true,    // Keep the file's extension
            maxFileSize: 10 * 1024 * 1024, // Limit the file size to 10MB
        });

        // Parse the form data
        const formData = await new Promise((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ fields, files });
                }
            });
        });

        const { fields, files } = formData;

        console.log("Received Fields:", fields);  // Regular form fields
            console.log("Received Files:", files); 

            const file = files.file[0];  // Assuming the file is uploaded under the name 'file'
        console.log("Uploaded file:", file);

        // Parse the form data
        const result = await insertMongoData({ ...fields, fileUrl: file.filepath });

        return json({ success: true, insertedId: result.insertedId }, { headers });
    } catch (error) {
        console.error("Server error:", error);
        return json({ success: false, message: 'Server error' }, { status: 500, headers });
    }
}