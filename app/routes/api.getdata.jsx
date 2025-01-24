import { json } from "@remix-run/node";
import { fetchMongoData, fetchMongoDataById } from "../entry.server";

export async function loader({ params }) {
  const { userId } = params;

  try {
    if (userId) {
      const user = await fetchMongoDataById(userId);

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return json(user);
    }

    const allData = await fetchMongoData();
    return json(allData);
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
