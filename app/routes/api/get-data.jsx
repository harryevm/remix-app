// app/routes/api/get-data.js
import { json } from "@remix-run/node";
import { fetchData, fetchMongoData } from "../../entry.server";



// Action handler for GET requests to fetch data from MongoDB
export async function loader() {
    try {
      const data = await fetchData();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return json({ error: "Failed to fetch data" }, { status: 500 });
    }
  }
