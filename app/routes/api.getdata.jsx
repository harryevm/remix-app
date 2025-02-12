// routes/api/test.jsx
import { json } from '@remix-run/node';  // for JSON response
import { fetchMongoData } from '../entry.server';


export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;  // Default to page 1
    const limit = 10;
    // Fetch data from MongoDB using the fetchMongoData function
    // const findResult = await fetchMongoData();
    const { findResult, totalItems } = await fetchMongoData(page, limit);

    // Return the data as JSON
    // return json(findResult);
    return json({ data: findResult, page, totalItems });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response('Error fetching data', { status: 500 });
  } 
}
