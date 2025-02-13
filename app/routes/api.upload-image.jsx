import { json } from '@remix-run/node';
import { insertMongoData } from '../entry.server';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';

// ... (Cloudinary configuration - keep environment variables!)

export async function action({ request }) {
    // ... (headers)

    if (request.method === 'POST') {
        try {
            const formData = await request.formData();
            // ... (name, email)
            const imageFile = formData.get('image');

            if (!imageFile) {
                // ...
            }

            // 1. Convert File object to a Buffer
            const buffer = await imageFile.arrayBuffer();
            const fileBuffer = Buffer.from(buffer);

            // 2. Return a Promise from the action
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'Shopify',
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Upload Error:', error);
                            reject(json({ success: false, message: 'Error uploading image to Cloudinary', error: error.message }, { status: 500, headers })); // Reject with error response
                            return; // Important: Stop further execution in the callback
                        }

                        const imageUrl = result.secure_url;

                        const mongoData = {
                            name,
                            email,
                            imageUrl,
                        };

                        insertMongoData(mongoData)
                            .then(() => {
                                resolve(json({ success: true, insertedId: result.public_id }, { headers })); // Resolve with success response
                            })
                            .catch((mongoError) => {
                                console.error("MongoDB Error:", mongoError);
                                reject(json({ success: false, message: 'Error inserting into MongoDB', error: mongoError.message }, { status: 500, headers }));
                            });
                    }
                );
                const readableStream = new Readable();
                readableStream.push(fileBuffer);
                readableStream.push(null);
                readableStream.pipe(uploadStream);
            });

        } catch (error) {
            console.error('Error processing data:', error);
            return json({ success: false, message: 'Error processing data', error: error.message }, { status: 500, headers }); // Return error response
        }
    }
}