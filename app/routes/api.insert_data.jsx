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

export async function action({ request }) {
  try {
    // Parse the incoming JSON data
    const jsonData = await request.json();
    
    // Insert the data into MongoDB
    const result = await insertMongoData(jsonData);
    
    return json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('Error inserting data:', error);
    return json({ success: false, message: 'Error inserting data' }, { status: 500 });
  }
}
