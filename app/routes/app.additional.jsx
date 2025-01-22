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
import React, { useEffect, useState } from "react";

// import { useLoaderData } from "@remix-run/react";
// import { fetchMongoData, insertData } from "../entry.server";


// export const loader = async () => {
//   const connectionStatus = await fetchMongoData();

//   const customData = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     age: 30,
//     address: "123 Main St",
//     city: "Anytown",
//     country: "Countryland"
//   };

//   try {
//     const result = await insertData(customData);
//     console.log("Inserted data:", result);
//   } catch (error) {
//     console.error("Error inserting data:", error);
//   }
  
//   return json(connectionStatus);
// };



export default function AdditionalPage() {
  // const { connected, message } = useLoaderData();
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("https://remix-app-88og.onrender.com/api/getdata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSampleData(data); // Assuming the API returns an array of objects
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const customizeFunc = () => {
    alert()
    // const nextElement = this.nextElementSibling;
    // if (nextElement) {
    //     if (nextElement.style.display === 'none' || nextElement.style.display === '') {
    //         nextElement.style.display = 'block'; 
    //     } else {
    //             nextElement.style.display = 'none';
    //     }
    // }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <div>
            <div class="dashboard">
	<div class="dashboard-info">
			<div class="dashboard-header">
				<h2>Dashboard</h2>
				<div class="accounts">
					<a href="" class="notification"><svg></svg></a>
					<a href="" class="profile"><img src="icon.png" /></a>
				</div>
			</div>
			<div class="dashboard-content">
				<div class="heading-wr">
					<h2>Property Listening</h2>
					<a id="customize-btn" onClick={customizeFunc} class="btn"><svg></svg>Customize Columns</a>
					<div class="columns">
						<h5>Columns</h5>
						<ul id="columns">
						    <li draggable="true"><input type="checkbox" value="name" checked /> name</li>
						    <li draggable="true"><input type="checkbox" value="email" checked /> email</li>
						    <li draggable="true"><input type="checkbox" value="phone" checked /> phone</li>
						    <li draggable="true"><input type="checkbox" value="address" checked /> address</li>
						    <li draggable="true"><input type="checkbox" value="city"checked  /> city</li>
						    <li draggable="true"><input type="checkbox" value="zip" /> zip</li>
						    <li draggable="true"><input type="checkbox" value="neighborhood" /> neighborhood</li>
						    <li draggable="true"><input type="checkbox" value="property-type" /> property-type</li>
						    <li draggable="true"><input type="checkbox" value="home-size" /> home-size</li>
						    <li draggable="true"><input type="checkbox" value="lot-size" /> lot-size</li>

                            <li draggable="true"><input type="checkbox" value="lot-unit" /> lot-unit</li>
                            <li draggable="true"><input type="checkbox" value="year-built" /> year-built</li>
                            <li draggable="true"><input type="checkbox" value="bedrooms" /> bedrooms</li>
                            <li draggable="true"><input type="checkbox" value="heating" /> heating</li>
                            <li draggable="true"><input type="checkbox" value="cooling" /> cooling</li>
                            <li draggable="true"><input type="checkbox" value="waterSource" /> waterSource</li>
                            <li draggable="true"><input type="checkbox" value="sewer" /> sewer</li>
                            <li draggable="true"><input type="checkbox" value="otherUtilities" /> otherUtilities</li>
                            <li draggable="true"><input type="checkbox" value="garage" /> garage</li>
                            <li draggable="true"><input type="checkbox" value="garage-specify" /> garage-specify</li>
                            <li draggable="true"><input type="checkbox" value="basement" /> basement</li>
                            <li draggable="true"><input type="checkbox" value="outdoorFeatures" /> outdoorFeatures</li>
                            <li draggable="true"><input type="checkbox" value="additionalFeatures" /> additionalFeatures</li>
                            <li draggable="true"><input type="checkbox" value="propertyPhotos" /> propertyPhotos</li>
                            <li draggable="true"><input type="checkbox" value="listingCheckbox" /> listingCheckbox</li>
                            <li draggable="true"><input type="checkbox" value="mediaRelease" /> mediaRelease</li>
                            <li draggable="true"><input type="checkbox" value="mediaReleaseDate" /> mediaReleaseDate</li>
                            <li draggable="true"><input type="checkbox" value="description" /> description</li>
                            <li draggable="true"><input type="checkbox" value="askingPrice" /> askingPrice</li>
                            <li draggable="true"><input type="checkbox" value="preferredContact" /> preferredContact</li>
                            <li draggable="true"><input type="checkbox" value="contactHours" /> contactHours</li>

                            <li draggable="true"><input type="checkbox" value="agencyCheckbox" /> agencyCheckbox</li>
                            <li draggable="true"><input type="checkbox" value="agencySignature" /> agencySignature</li>
                            <li draggable="true"><input type="checkbox" value="agencyDate" /> agencyDate</li>
                            <li draggable="true"><input type="checkbox" value="agencyAgreement" /> agencyAgreement</li>
                            <li draggable="true"><input type="checkbox" value="fairHousingCheckbox" /> fairHousingCheckbox</li>
                            <li draggable="true"><input type="checkbox" value="fairHousingSignature" /> fairHousingSignature</li>
                            <li draggable="true"><input type="checkbox" value="fairHousingDate" /> fairHousingDate</li>
                            <li draggable="true"><input type="checkbox" value="fairHousing" /> fairHousing</li>
                            <li draggable="true"><input type="checkbox" value="propertyCheckbox" /> propertyCheckbox</li>
                            <li draggable="true"><input type="checkbox" value="propertySignature" /> propertySignature</li>
                            <li draggable="true"><input type="checkbox" value="propertyDate" /> propertyDate</li>
                            <li draggable="true"><input type="checkbox" value="propertyDisclosure" /> propertyDisclosure</li>

                            <li draggable="true"><input type="checkbox" value="listingSignature" /> listingSignature</li>
                            <li draggable="true"><input type="checkbox" value="listingDate" /> listingDate</li>
                            <li draggable="true"><input type="checkbox" value="listingAgreement" /> listingAgreement</li>
                            


						</ul>

						<a class="btn" id="done-button">Done</a>
					</div>
				</div>
				<div class="table">
					<table>
					    <thead>
					        <tr id="table-header"></tr>
					    </thead>
					    <tbody id="table-body"></tbody>
					</table>

				</div>
			</div>
			<div class="footer">All Content &#169; NYFISBO. All Rights Reserved</div>
		</div>
	</div>
              
            </div>
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
