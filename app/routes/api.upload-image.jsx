import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return json({ error: "No file provided" }, { status: 400 });
  }

  // Step 1: Get a staged upload URL from Shopify
  const stagedUpload = await getShopifyStagedUpload(file);
  if (!stagedUpload) {
    return json({ error: "Failed to get Shopify upload URL" }, { status: 500 });
  }

  // Step 2: Upload the file directly to Shopify
  const uploadResponse = await uploadToShopifyS3(stagedUpload, file);
  if (!uploadResponse) {
    return json({ error: "File upload to Shopify failed" }, { status: 500 });
  }

  // Step 3: Finalize the file upload in Shopify
  const finalizeResponse = await finalizeShopifyUpload(stagedUpload);
  if (!finalizeResponse) {
    return json({ error: "Failed to finalize file in Shopify" }, { status: 500 });
  }

  return json({ success: true, file: finalizeResponse });
};

// 1️⃣ Request a staged upload URL from Shopify
async function getShopifyStagedUpload(file) {
  const query = `
    mutation generateUploadUrl($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          resourceUrl
          url
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: [
      {
        filename: file.name,
        mimeType: file.type,
        resource: "FILE",
      },
    ],
  };

  const response = await fetch(
    "https://trevorf-testing.myshopify.com/admin/api/2025-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": "shpua_fe44c36d29738de95bf9cfcc4fb11f23",
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const data = await response.json();
  return data?.data?.stagedUploadsCreate?.stagedTargets?.[0] || null;
}

// 2️⃣ Upload the file to Shopify's generated URL
async function uploadToShopifyS3(stagedUpload, file) {
  const formData = new FormData();
  
  stagedUpload.parameters.forEach(({ name, value }) => {
    formData.append(name, value);
  });

  formData.append("file", file);

  const response = await fetch(stagedUpload.url, {
    method: "POST",
    body: formData,
  });

  return response.ok;
}

// 3️⃣ Finalize the file upload in Shopify
async function finalizeShopifyUpload(stagedUpload) {
  const query = `
    mutation finalizeUpload($input: [FileCreateInput!]!) {
      fileCreate(files: $input) {
        files {
          id
          url
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: [
      {
        originalSource: stagedUpload.resourceUrl,
        contentType: "IMAGE",
      },
    ],
  };

  const response = await fetch(
    "https://trevorf-testing.myshopify.com/admin/api/2025-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": "shpua_fe44c36d29738de95bf9cfcc4fb11f23",
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const data = await response.json();
  return data?.data?.fileCreate?.files?.[0] || null;
}
