import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";
import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://harish_c:harish_c@cluster0.kdyad.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
export async function fetchMongoData() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("Trevor"); // Replace with your database name
    const collection = db.collection("Trevor"); // Replace with your collection name

    const data = await collection.find({}).toArray();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    await client.close();
  }
}

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


// server/api.js
import express from "express";
import { fetchMongoData } from "./mongo.js";

const app = express();

app.get("/api/mongo-data", async (_req, res) => {
  try {
    const data = await fetchMongoData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch data" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
