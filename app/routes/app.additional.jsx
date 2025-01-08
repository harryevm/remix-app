// AdditionalPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { fetchMongoData } from "../entry.server";

export const loader = async () => {
  try {
    const data = await fetchMongoData();
    console.log(data);
    // return json({ success: true, data });
  } catch (error) {
    console.error("Error in loader:", error);
    // return json({ success: false, error: "Failed to fetch data" });
  }
};

export default function AdditionalPage() {
  const { success, data, error } = useLoaderData();



  return (
    <Page>
      <TitleBar title="Additional Page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
            <h1>MongoDB Data</h1>
      {success ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Error: {error}</p>
      )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
