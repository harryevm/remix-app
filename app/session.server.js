import { createCookieSessionStorage } from "@remix-run/node";


// Session secret for secure cookies (use a secret key in production)
const sessionSecret = process.env.SESSION_SECRET || "585858";

// Create cookie session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "mysession",  // Name of the session cookie
    secure: process.env.NODE_ENV === "production", // Ensure it's secure in production
    httpOnly: true,  // Don't allow JS access to the cookie (security)
    maxAge: 60 * 60 * 24 * 7,  // Keep the session alive for 7 days
    path: "/",
    sameSite: "lax",  // Ensures cookies are sent with cross-origin requests
    secrets: [sessionSecret],  // Use secret for encryption
  },
});

// Get session data from the request
export async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return storage.getSession(cookie);
}

// Commit session to save data and return cookie header
export async function commitSession(session) {
  return storage.commitSession(session);
}

// Destroy the session and clear the cookie
export async function destroySession(session) {
  return storage.destroySession(session);
}
