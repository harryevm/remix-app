import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";

// import { useLoaderData } from "@remix-run/react";
// import { fetchMongoData, insertData } from "../entry.server";


// export const loader = async () => {
//   const connectionStatus = await fetchMongoData();

//   const customData = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     age: 30,
//     address: "123 Main St",
//     city: "Anytown",
//     country: "Countryland"
//   };

//   try {
//     const result = await insertData(customData);
//     console.log("Inserted data:", result);
//   } catch (error) {
//     console.error("Error inserting data:", error);
//   }
  
//   return json(connectionStatus);
// };



export default function AdditionalPage() {
  // const { connected, message } = useLoaderData();
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("https://remix-app-88og.onrender.com/api/getdata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSampleData(data); // Assuming the API returns an array of objects
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
            <div>
              <h1>Sample Data</h1>
              <ul>
                {sampleData.map((item, index) => (
                  <li key={index}>
                    <strong>Name:</strong> {item.name} <br />
                    <strong>Email:</strong> {item.email} <br />
                    <strong>Phone:</strong> {item.phone} <br />
                    <strong>Address:</strong> {item.address} <br />
                    {/* Add more fields as needed */}
                  </li>
                ))}
              </ul>
            </div>
    </>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
