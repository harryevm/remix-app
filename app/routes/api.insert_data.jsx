// // app/routes/api/submit-form.js
// import { json } from "@remix-run/node";
// import { insertData } from "../../../entry.server"; // Import your insert function
// import { validateFormData } from "../utils/validation"; // Optional: a utility for validating data

// export async function action({ request }) {
//   const formData = new URLSearchParams(await request.text()); // Parse form data from the request body
  
//   const name = formData.get("name");
//   const email = formData.get("email");
//   const address = formData.get("address");
//   const city = formData.get("city");
//   const country = formData.get("country");

//   // Optionally, validate the form data
//   if (!name || !email || !address || !city || !country) {
//     return json({ error: "All fields are required." }, { status: 400 });
//   }

//   const customData = {
//     name,
//     email,
//     address,
//     city,
//     country,
//   };

//   try {
//     // Insert the data into MongoDB
//     const result = await insertData(customData);
//     console.log("Inserted data:", result);
//     return json({ success: true, message: "Data successfully saved!" });
//   } catch (error) {
//     console.error("Error inserting data:", error);
//     return json({ success: false, message: "Failed to save data" }, { status: 500 });
//   }
// }
