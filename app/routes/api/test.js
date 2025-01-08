// app/routes/api/test.js
import { json } from "@remix-run/node";

export async function loader() {
  return json({ message: "Test route works!" });
}
