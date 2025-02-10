import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
// import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://harish_c:harish_c@cluster0.kdyad.mongodb.net/?retryWrites=true&w=majority";

 
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(",") || "read_products,write_products,write_files,read_files,read_themes,write_themes",
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  // sessionStorage: new PrismaSessionStorage(prisma),
  // sessionStorage: new MongoDBSessionStorage(
  //   'mongodb+srv://harish_c:harish_c@cluster0.kdyad.mongodb.net/?retryWrites=true&w=majority',
  //   'test',  // Replace with your actual database name
  // ),
  // sessionStorage: new MemorySessionStorage(),
  sessionStorage: new MongoDBSessionStorage(MONGO_URI, "Trevor", {
    cookieOptions: {
      sameSite: "None",
      secure: false,
    },
  }),

  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
