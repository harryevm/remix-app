/* 13/02/2025 
import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';





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
        'Access-Control-Allow-Origin': '*',  // For testing. Change to your Shopify domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };
    
      // Handle preflight requests
      if (request.method === 'POST') {

        try {
            // Parse the incoming JSON data
            const jsonData = await request.json();
            
            // Insert the data into MongoDB
            const result = await insertMongoData(jsonData);
            
            // // return json({ success: true, insertedId: result.insertedId });
            return json({ success: true, insertedId: result.insertedId }, { headers });

            

        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
 13/02/2025 */


import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';

import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer'; 

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'de4fo1raf',
    api_key: '942849615248768',
    api_secret: 'QoigN9bkSQiqLiJ7AeVjWQElC4E',
});

// Nodemailer transporter setup (Replace with your SMTP settings)
// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//       user: "52d65f12ff66c5",
//       pass: "3287542646728a"
//   }
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'harish@expertvillagemedia.com',  // Replace with your email
      pass: 'xlrk sxlx vnxv ushd'   // Use an App Password if using Gmail
  }
});



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
    return json({ message: 'Invalid request' }, { status: 405 });

  }

  
export async function action({ request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // For testing. Change to your Shopify domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };

      
    
      // Handle preflight requests
      if (request.method === 'POST') {
      
       
        
       

        try {
            const formData = await request.formData();
            const formFields = {};
            const imageUrls = [];
            const uploadPromises = [];

            for (let [key, value] of formData.entries()) {
              if (value instanceof File) {
                  // If file, handle the file upload
                  const buffer = await value.arrayBuffer();
                  const fileBuffer = Buffer.from(buffer);

                  // Create a promise for each image upload to Cloudinary
                  const uploadPromise = new Promise((resolve, reject) => {
                      const uploadStream = cloudinary.v2.uploader.upload_stream(
                          { folder: 'Shopify' },
                          (error, result) => {
                              if (error) {
                                  reject(error);
                              } else {
                                  resolve(result.secure_url); // Get the image URL after upload
                              }
                          }
                      );

                      const readableStream = new Readable();
                      readableStream.push(fileBuffer);
                      readableStream.push(null);
                      readableStream.pipe(uploadStream);
                  });

                  // Add the promise to the array for the respective field (image1, propertyType, etc.)
                  if (!imageUrls[key]) {
                      imageUrls[key] = [];  // Initialize array if not already present
                  }

                  uploadPromises.push(uploadPromise.then(url => {
                    console.log('Uploaded Image URL:', url); 
                      imageUrls[key].push(url);  // Push the URL into the respective field's array
                  }));
              } else {
                  // Otherwise, store regular form fields (e.g., name, email, etc.)
                  formFields[key] = value;
              }
          }

          // Wait for all image uploads to finish
          await Promise.all(uploadPromises);

          // Validate email field
          if (!formFields.email) {
              return json({ success: false, message: "Email is required." }, { status: 400 });
          }

          // Prepare the final data to save in MongoDB
          const mongoData = {
              ...formFields,
              ...imageUrls,  // Add the image URLs to the document dynamically
          };

          const insertedResult = await insertMongoData(mongoData);

          // Generate a PDF
          const pdfFilename = `${insertedResult.insertedId}.pdf`;
          // const pdfPath = path.join(process.cwd(), "public", "pdfs", pdfFilename);

          // if (!fs.existsSync(path.join(process.cwd(), "public", "pdfs"))) {
          //     fs.mkdirSync(path.join(process.cwd(), "public", "pdfs"), { recursive: true });
          // }

          const doc = new PDFDocument();
          const pdfBuffer = await new Promise((resolve, reject) => {
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);
        
            doc.fontSize(18).text("Property Details", { align: "center" });
            doc.moveDown();
            
            for (const [key, value] of Object.entries(formFields)) {
              if (value) {
                  const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                  doc.fontSize(12).text(`${formattedKey}: ${value}`);
                  doc.moveDown(0.5);
              }
            }

            // Add uploaded image URLs
            if (Object.keys(imageUrls).length > 0) {
                doc.fontSize(14).text("Uploaded Images:", { underline: true });
                Object.entries(imageUrls).forEach(([key, urls]) => {
                    doc.fontSize(12).text(`${key}:`);
                    urls.forEach(url => doc.text(url, { link: url, underline: true }));
                    doc.moveDown();
                });
            }
            doc.end();
        });
        
        // Upload the generated PDF buffer to Cloudinary
        // const pdfUploadResult = await new Promise((resolve, reject) => {
        //     const uploadStream = cloudinary.v2.uploader.upload_stream(
        //         { folder: "PDFs", resource_type: "raw",public_id: pdfFilename.replace(".pdf", ""),format: "pdf" },
        //         (error, result) => {
        //             if (error) reject(error);
        //             else resolve(result.secure_url);
        //         }
        //     );
        //     Readable.from(pdfBuffer).pipe(uploadStream);
        // });

            // 📧 Send Email with PDF
            const mailOptions = {
              from: "test@example.com",
              to: `${formFields.email}`, // Send to user & test email
              subject: "Your Form Submission",
              text: "Thank you for submitting the form. Attached is your PDF.",
              attachments: [
                {
                    filename: pdfFilename,
                    content: pdfBuffer, // Attach the actual buffer
                    contentType: "application/pdf"
                }
            ]
          };

            await transporter.sendMail(mailOptions);
            

          return json({ success: true, insertedId: mongoData._id, imageUrls  }, { headers });

      } catch (error) {
          console.error('Error inserting data:', error);
          return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
      }
  }
}
