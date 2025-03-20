import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";
import { MongoClient, ObjectId } from "mongodb";


const url =
  "mongodb+srv://harish_c:harish_c@cluster0.kdyad.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

// Database Name
const dbName = 'Trevor';


export const streamTimeout = 5000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );

    // Automatically timeout the React renderer after 6 seconds, which ensures
    // React has enough time to flush down the rejected boundary contents
    setTimeout(abort, streamTimeout + 1000);
  });
}


export async function fetchMongoData(limit = null) {
  try {
    // Reuse client if already connected
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    
    const collection = db.collection('Trevor');

    // Example query, replace with actual data fetching logic
    let query  = await collection.find({}).sort({ createdAt: -1 });
    if (limit) {
      query = query.limit(limit);
    }
    const findResult = await query.toArray();


    return findResult;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchMongoDataById(userId) {
  const objectId = new ObjectId(userId);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Trevor");
    const findResult = await collection.findOne({ _id: objectId });
    // Fetching the user by their string ID
    return findResult;
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    throw error;
  }
}





export async function insertMongoData(data) {
 
  try {
    await client.connect();
    const db = client.db('Trevor');
    const collection = db.collection('Trevor');
    data.createdAt = new Date(); 
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}



export async function totalPropertyCount() {
  try {
    // Reuse client if already connected
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    
    const collection = db.collection('Trevor');

    // Example query, replace with actual data fetching logic
    const findResult = await collection.count()


    return findResult;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function totalUserCount() {
  try {
    // Reuse client if already connected
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('Trevor');

    // Use aggregation to count unique emails
    const uniqueEmailCount = await collection.aggregate([
      { $group: { _id: "$email" } },   // Group by email field
      { $count: "uniqueEmails" }        // Count the unique emails
    ]).toArray();

    // If no result, return 0 (in case the collection is empty or no unique emails)
    return uniqueEmailCount.length > 0 ? uniqueEmailCount[0].uniqueEmails : 0;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
