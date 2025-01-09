export async function loader({ request }) {
    // Your existing API logic here
    return new Response(JSON.stringify({ message: "API is working" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }