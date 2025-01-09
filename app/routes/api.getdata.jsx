// routes/api/get-data.js
import { json } from "@remix-run/node";
import { fetchMongoData } from "../entry.server";



export async function loader(data) {
  try {
    const data = await fetchMongoData();
    return data; // Return data as JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    return json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
