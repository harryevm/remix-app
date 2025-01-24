import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { fetchMongoDataById } from "~/entry.server";

export async function loader({ params }) {
  const { userId } = params;

  try {
    const user = await fetchMongoDataById(userId);

    if (!user) {
      throw new Response("User not found", { status: 404 });
    }

    return json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Response("Failed to load user data", { status: 500 });
  }
}

export default function UserDetailPage() {
  const user = useLoaderData();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Address: {user.address}</p>
      <p>City: {user.city}</p>
      <p>ZIP: {user.zip}</p>
      <p>Property Type: {user["property-type"]}</p>
      <p>Home Size: {user["home-size"]}</p>
      <p>Year Built: {user["year-built"]}</p>
      <p>Bedrooms: {user.bedrooms}</p>
    </div>
  );
}
