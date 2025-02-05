import { json } from '@remix-run/node';
import formidable from 'formidable';
import { insertMongoData } from '../entry.server';

const allowedOrigin = 'https://trevorf-testing.myshopify.com'; // Shopify store domain

// Handle the OPTIONS request to enable preflight checks for CORS
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

    // Handle OPTIONS request for preflight check
    if (request.method === 'OPTIONS') {
        return new Response(null, { 
            status: 204, 
            headers 
        });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
        return json({ success: false, message: "Invalid request method" }, { status: 405, headers });
    }

    try {
        const form = formidable({
            uploadDir: './uploads',
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // Max file size 10MB
        });

        // Parse the form data asynchronously
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
        console.log("Received Files:", files);    // File data

        const file = files.file[0];  // Assuming the file is uploaded under the name 'file'
        console.log("Uploaded file:", file);

        // Insert data into MongoDB (including file URL)
        const result = await insertMongoData({ ...fields, fileUrl: file.filepath });

        return json({ success: true, insertedId: result.insertedId }, { headers });
    } catch (error) {
        console.error("Server error:", error);
        return json({ success: false, message: 'Server error' }, { status: 500, headers });
    }
}
