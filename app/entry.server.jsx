import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";
import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://harish_c:harish_c@cluster0.kdyad.mongodb.net/?retryWrites=true&w=majority&tls=true";
const client = new MongoClient(url, { tlsAllowInvalidCertificates: true });


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
    await client.connect();
    console.log("Connected to MongoDB");
    return { connected: true, message: "Successfully connected to MongoDB" };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return { connected: false, message: error.message };
  } finally {
    await client.close();
  }
}

export async function insertData(customData) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("Trevor"); // Use your database name
    const collection = db.collection("Trevor"); // Use your collection name

    // Insert custom data into the collection
    const result = await collection.insertOne(customData);
    console.log("Data inserted:", result);

    return result; // Return the result for further use if needed
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  } finally {
    await client.close();
  }
}
