import { useLoaderData } from "@remix-run/react";

export async function loader({ params }) {
  const response = await fetch(`/api/getdata/${params.userId}`);
  if (!response.ok) {
    throw new Error("Failed to load user data");
  }
  return response.json();
}

export default function UserDetailPage() {
  const user = useLoaderData();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      {/* Add more user details here */}
    </div>
  );
}
