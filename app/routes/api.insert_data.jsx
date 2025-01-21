// import { json } from '@remix-run/node';  // For JSON response
// import { insertMongoData } from '../entry.server';


// export async function action({ request }) {
//   try {
//     // Parse the incoming form data (application/x-www-form-urlencoded or JSON)
//     const formData = await request.formData();

//     // Create an empty object to store form data dynamically
//     const data = {};

//     // Loop through each form field and dynamically add it to the data object
//     formData.forEach((value, key) => {
//       data[key] = value;
//     });

//     // Insert the data into MongoDB
//     const result = await insertMongoData(data);

//     // Return the result of the insertion
//     return json({ success: true, insertedId: result.insertedId });
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     return json({ success: false, message: 'Error inserting data' }, { status: 500 });
//   }
// }

import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';
import fs from "fs";
import path from "path";
import formidable from 'formidable';


const uploadsDir = path.resolve('app', 'routes', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  await fs.mkdir(uploadsDir, { recursive: true });
}


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
        const form = formidable({
          multiples: false,
          uploadDir: uploadsDir,
          keepExtensions: true,
        });
        
        try {
          const parsedForm = await new Promise((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
              if (err) reject(err);
              else resolve({ fields, files });
            });
          });

          const { name, email, address, phone } = parsedForm.fields;
          const { image } = parsedForm.files;
    
          if (!image) {
            throw new Error('No file uploaded');
          }
    
          const randomNumber = Math.floor(Math.random() * 100000);
          const folderName = `${randomNumber}-${email}`;
          const uploadFolder = path.join(uploadsDir, folderName);
    
          // Ensure the directory exists
          await fs.mkdir(uploadFolder, { recursive: true });
    
          // Move the uploaded file to the new folder
          const fileName = path.basename(image.filepath);
          const filePath = path.join(uploadFolder, fileName);
          await fs.rename(image.filepath, filePath);
    
          // Generate the file URL
          const fileUrl = `https://remix-app-88og.onrender.com/uploads/${folderName}/${fileName}`;
    
          // Insert data into MongoDB
          const data = { name, email, address, phone, imageUrl: fileUrl };
          const result = await insertMongoData(data);
    
          return json({ success: true, insertedId: result.insertedId, fileUrl }, { headers });

        } catch (error) {
          console.error('Error handling file upload:', error);
          return json({ success: false, message: 'Error handling file upload' }, { status: 500, headers });
        }
    }
    return json({ success: false, message: 'Method not allowed' }, { status: 405, headers });
}
