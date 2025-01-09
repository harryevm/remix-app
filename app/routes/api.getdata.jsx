// routes/api/get-data.js
import { json } from "@remix-run/node";
import { fetchMongoData } from "../entry.server";



export async function loader() {
    const { db,collection } = await fetchMongoData();
  
    // Query your MongoDB collection (e.g., "users" collection)
    const data = collection.find({}).toArray(); // change the collection as needed
  
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
