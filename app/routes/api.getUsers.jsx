// routes/api/test.jsx
import { json } from '@remix-run/node';  // for JSON response
import { totalUserCount } from '../entry.server';

export async function loader() {
  try {
    // Fetch data from MongoDB using the fetchMongoData function
    const findResult = await totalUserCount();

    // Return the data as JSON
    return json(findResult);
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response('Error fetching data', { status: 500 });
  } 
}
