import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  // 1️⃣ Convert file to a Buffer
  const fileBuffer = await file.arrayBuffer();

  // 2️⃣ Upload file to a temporary hosting service (e.g., S3, Cloudinary, etc.)
  const publicUrl = await uploadToCloud(fileBuffer, file.name); // Replace with your upload logic

  // 3️⃣ Send the file to Shopify using GraphQL
  const shopifyResponse = await uploadToShopify(publicUrl);

  return json({ success: true, shopifyResponse });
};

// Upload file to Shopify GraphQL API
async function uploadToShopify(fileUrl) {
  const shopifyGraphQL = "https://trevorf-testing.myshopify.com/admin/api/2025-01/graphql.json";

  const query = `
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          id
          fileStatus
          alt
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    files: [
      {
        originalSource: fileUrl,
        contentType: "IMAGE",
      },
    ],
  };

  const response = await fetch(shopifyGraphQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": "shpua_fe44c36d29738de95bf9cfcc4fb11f23",
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
}
