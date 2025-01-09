// routes/api/get-data.js
import { json } from "@remix-run/node";
import { fetchMongoData } from "../../entry.server";


export function loader() {
  return new Response('API Test is working!');
}
