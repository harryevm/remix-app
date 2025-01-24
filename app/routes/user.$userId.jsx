import { useLoaderData, useParams } from '@remix-run/react';


import { fetchMongoDataById } from '../entry.server';

export const loader = async ({ params }) => {
    // const { userId } = params; // Destructure userId from params
    const { userId } = useParams();
    
    console.log(userId);
    
     const data = await fetchMongoDataById(userId); // Use userId instead of 'item'
  
    if (!data) {
      throw new Response('Item not found', { status: 404 });
    }
  
    return { data };
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