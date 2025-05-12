import { config as configDotenv } from "dotenv";
configDotenv();
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";
import { MongoClient, ObjectId } from "mongodb";

const url = process.env.MONGO_URL;
const dbName = 'trevor_form';
const collectionName = 'trevor_form';

const client = new MongoClient(url);

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

// Ensure a single client connection is reused
async function getMongoCollection() {
  await client.connect(); // Safe to call multiple times
  const db = client.db(dbName);
  return db.collection(collectionName);
}


export async function fetchMongoData(limit = null) {
  try {
    // Reuse client if already connected
    const collection = await getMongoCollection();

    // Example query, replace with actual data fetching logic
    let cursor = collection.find({}).sort({ createdAt: -1 });
    if (limit) {
      cursor = cursor.limit(limit);
    }
    return await cursor.toArray();

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchMongoDataById(userId) {
  try {
    const collection = await getMongoCollection();
    const objectId = new ObjectId(userId);
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
    const collection = await getMongoCollection();
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
     const collection = await getMongoCollection();

    // Example query, replace with actual data fetching logic
    const findResult = await collection.countDocuments();
    return findResult;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function totalUserCount() {
  try {
    const collection = await getMongoCollection();

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
