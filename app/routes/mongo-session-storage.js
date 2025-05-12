import { MongoClient } from "mongodb";

const url = "mongodb://trevor_form:3E8Y8XFCB1L0Nvd@3.208.138.53:27017/trevor_form?authSource=trevor_form";



// Database Name
const dbName = 'trevor_form';

const client = new MongoClient(url);
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