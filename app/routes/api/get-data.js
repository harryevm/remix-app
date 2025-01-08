// app/routes/api/get-data.js
import { json } from "@remix-run/node";
import { fetchData } from "../../entry.server";


// Action handler for GET requests to fetch data from MongoDB
export async function loader() {
  try {
    // Fetch data from MongoDB
    const data = await fetchData();
    
    // Return the data in a JSON response
    return json({ success: true, data: data });
  } catch (error) {
    // Handle any errors that occur during data fetching
    console.error("Error fetching data:", error);
    return json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
