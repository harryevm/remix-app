import { useLoaderData } from '@remix-run/react';
import { fetchMongoDataById } from '../entry.server';

export const loader = async ({ params }) => {
  const { userId } = params; // `params` already contains userId from the URL

  console.log('Fetching user with ID:', userId);

  const data = await fetchMongoDataById(userId); // Use the userId here
  
  if (!data) {
    throw new Response('Item not found', { status: 404 });
  }

  return { data };
};

export default function ItemPage() {
  const { data } = useLoaderData();

  return (
    <div>
      <h1>{data.name}</h1>
      {/* Render other data fields as needed */}
    </div>
  );
}
