import { MongoClient } from "mongodb";

const url =
"mongodb+srv://harish_c:harish_c@cluster0.kdyad.mongodb.net/?retryWrites=true&w=majority";



// Database Name
const dbName = 'test';

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
const db = client.db(dbName);
const collection = db.collection('shopify_sessions');

// Load session from MongoDB
export async function loadSession(request) {
const shop = request.headers.get("X-Shopify-Shop-Domain");
if (!shop) return null;

const session = await collection.findOne({ shop });
return session || null;
}


// Store session in MongoDB
export async function storeSession(session) {
const { shop, id, state, scope, accessToken, isOnline } = session;

const result = await collection.updateOne(
    { shop },
    { $set: { shop, id, state, scope, accessToken, isOnline, createdAt: new Date() } },
    { upsert: true }
);

return result;
}

// Delete session from MongoDB
export async function deleteSession(request) {
const shop = request.headers.get("X-Shopify-Shop-Domain");
if (shop) {
    await collection.deleteOne({ shop });
}
}