import { useLoaderData, useParams } from '@remix-run/react';


import { fetchMongoDataById } from '../entry.server';

export const loader = async ({ params }) => {
    const { userId } = params; // Destructure userId from params
    
    console.log(userId); // Log userId to check if it's correct
    
    const data = await fetchMongoDataById(userId); // Use userId to fetch data
    
    if (!data) {
      throw new Response('Item not found', { status: 404 });
    }
  
    return { data }; // Return the fetched data
  };
  

// export default function ItemPage() {
//   const { data } = useLoaderData();

//   return (
//     <div>
//       <h1>{data.name}</h1>

//       {/* Render other data fields as needed */}
//     </div>
//   );
// }