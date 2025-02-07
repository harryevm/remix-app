import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";


// Function to handle the main request
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


export async function fetchMongoData() {
  try {
    // Reuse client if already connected
    const db = await connectToDatabase();
    const collection = db.collection("Trevor");

    // Example query, replace with actual data fetching logic
    const findResult = await collection.find({}).toArray();


    return findResult;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchMongoDataById(userId) {
  const objectId = new ObjectId(userId);
  try {
    const db = await connectToDatabase();
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
    const db = await connectToDatabase();
    const collection = db.collection("Trevor");
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}
