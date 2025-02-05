import { json } from '@remix-run/node';  
import { insertMongoData } from '../entry.server';
import IncomingForm from 'formidable/Formidable';
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

    if (request.method !== "POST") {
        return json({ success: false, message: "Invalid request method" }, { status: 405, headers });
    }

    try {
        const form = new IncomingForm();
        form.parse(request, async (err, fields, files) => {
            if (err) {
                return json({ success: false, message: "Error processing the form", error: err }, { status: 400, headers });
            }

            console.log("Fields:", fields);
            console.log("Files:", files);

            // Example: Save file information into MongoDB (files will contain file details)
            // If you want to handle the file (e.g., save it, upload to Shopify, etc.)
            const file = files.file[0];  // Assuming the file is named 'file' in the form data

            // You can now handle the file, for example, upload it to Shopify Files API
            // Or move the file to your desired location, etc.
            console.log("Uploaded file:", file);

            // Insert the form data (including file info) into MongoDB
            // Example:
            // const result = await insertMongoData({ ...fields, fileUrl: file.filepath });

            return json({ success: true, fileUrl: file.filepath, fields });
        });
    } catch (error) {
        console.error("Error:", error);
        return json({ success: false, message: 'Server error' }, { status: 500, headers });
    }

    // } catch (error) {
    //     console.error("Error:", error);
    //     return json({ success: false, message: 'Server error' }, { status: 500, headers });
    // }
}
