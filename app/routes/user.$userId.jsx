
import { fetchMongoDataById } from '../entry.server';

export const loader = async ({ params }) => {
  const { userId } = params;

  console.log(userId); // Log userId to check if it's correct

  try {
    const data = await fetchMongoDataById(userId); // Use userId to fetch data

    if (!data) {
      throw new Response('Item not found', { status: 404 });
    }

    return { data }; // Return the fetched data
  } catch (error) {
    console.error("Error loading data:", error);
    throw new Response('Error loading data', { status: 500 });
  }
};

