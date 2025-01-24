import { json, useLoaderData } from 'remix';
import { fetchMongoDataById } from '../entry.server';

export const loader = async ({ params }) => {
  const { userId } = params;

  console.log(userId); // Log userId to check if it's correct

  try {
    const data = await fetchMongoDataById(userId); // Use userId to fetch data

    if (!data) {
      throw new Response('Item not found', { status: 404 });
    }

    return json({ data }); // Return the fetched data
  } catch (error) {
    console.error("Error loading data:", error);
    throw new Response('Error loading data', { status: 500 });
  }
};

export default function UserPage() {
  const { data } = useLoaderData();

  return (
    <div>
      <h1>User Details</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
