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
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchMongoData, insertData } from "../entry.server";


export const loader = async () => {
  const connectionStatus = await fetchMongoData();

  const customData = {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
    address: "123 Main St",
    city: "Anytown",
    country: "Countryland"
  };

  try {
    const result = await insertData(customData);
    console.log("Inserted data:", result);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
  
  return json(connectionStatus);
};



export default function AdditionalPage() {
  const { connected, message } = useLoaderData();
  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                The app template comes with an additional page which
                demonstrates how to create multiple pages within app navigation
                using{" "}
                <Link
                  url="https://shopify.dev/docs/apps/tools/app-bridge"
                  target="_blank"
                  removeUnderline
                >
                  App Bridge
                </Link>
                .
              </Text>
              <Text as="p" variant="bodyMd">
                To create your own page and have it show up in the app
                navigation, add a page inside <Code>app/routes</Code>, and a
                link to it in the <Code>&lt;NavMenu&gt;</Code> component found
                in <Code>app/routes/app.jsx</Code>.
              </Text>
              <h1>MongoDB Connection Status</h1>
              <p>
                {connected ? (
                  <Text as="span" color="success">
                    ✅ {message}
                  </Text>
                ) : (
                  <Text as="span" color="critical">
                    ❌ {message}
                  </Text>
                )}
              </p>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
