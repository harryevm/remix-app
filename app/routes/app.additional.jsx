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

export default function AdditionalPage() {
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/mongo-data"); // Replace with your API endpoint
        const result = await response.json();

        if (result.success) {
          setMongoData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to fetch MongoDB data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Page>
      <TitleBar title="Additional Page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              {loading && <Text>Loading...</Text>}
              {error && <Text>Error: {error}</Text>}
              {!loading && !error && (
                <Text as="p" variant="bodyMd">
                  MongoDB Data: <pre>{JSON.stringify(mongoData, null, 2)}</pre>
                </Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
