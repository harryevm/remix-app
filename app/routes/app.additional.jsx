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

    const script = document.createElement('script');
    script.innerHTML = `
      document.addEventListener("DOMContentLoaded", () => {
          const columns = document.getElementById("columns");
          const doneButton = document.getElementById("done-button");
          const tableHeader = document.getElementById("table-header");
          const tableBody = document.getElementById("table-body");

          // Sample data for demonstration
          const sampleDatas = [
              sampleData
          ];

          // Function to update the table based on selected checkboxes
          function updateTable() {
              const selectedColumns = Array.from(columns.querySelectorAll("input:checked")).map(
                  checkbox => checkbox.value
              );

              // Update table headers
              tableHeader.innerHTML = "";
              selectedColumns.forEach(column => {
                  const th = document.createElement("th");
                  th.textContent = column;
                  tableHeader.appendChild(th);
              });

              // Always add "View" column
              const viewTh = document.createElement("th");
              viewTh.textContent = 'Action';
              tableHeader.appendChild(viewTh);

              // Update table body
              tableBody.innerHTML = "";
              sampleDatas.forEach(row => {
                  const tr = document.createElement("tr");
                  selectedColumns.forEach(column => {
                      const td = document.createElement("td");
                      td.textContent = row[column] || "";
                      tr.appendChild(td);
                  });

                  // Add "View" button to each row
                  const viewTd = document.createElement("td");
                  const viewButton = document.createElement("button");
                  viewButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none"> <g clip-path="url(#clip0_1_4192)"> <path d="M11 3.4787C15.9427 3.4787 20.0548 7.03537 20.9174 11.7287C20.0557 16.422 15.9427 19.9787 11 19.9787C6.05733 19.9787 1.94516 16.422 1.08258 11.7287C1.94425 7.03537 6.05733 3.4787 11 3.4787ZM11 18.1454C12.8695 18.145 14.6835 17.51 16.1451 16.3443C17.6067 15.1786 18.6293 13.5513 19.0456 11.7287C18.6278 9.90756 17.6045 8.28204 16.1431 7.11789C14.6816 5.95374 12.8684 5.31985 11 5.31985C9.13155 5.31985 7.31838 5.95374 5.85693 7.11789C4.39547 8.28204 3.3722 9.90756 2.95441 11.7287C3.37067 13.5513 4.39328 15.1786 5.85488 16.3443C7.31648 17.51 9.13048 18.145 11 18.1454ZM11 15.8537C9.90598 15.8537 8.85677 15.4191 8.08318 14.6455C7.30959 13.8719 6.875 12.8227 6.875 11.7287C6.875 10.6347 7.30959 9.58547 8.08318 8.81188C8.85677 8.0383 9.90598 7.6037 11 7.6037C12.094 7.6037 13.1432 8.0383 13.9168 8.81188C14.6904 9.58547 15.125 10.6347 15.125 11.7287C15.125 12.8227 14.6904 13.8719 13.9168 14.6455C13.1432 15.4191 12.094 15.8537 11 15.8537ZM11 14.0204C11.6078 14.0204 12.1907 13.7789 12.6205 13.3492C13.0502 12.9194 13.2917 12.3365 13.2917 11.7287C13.2917 11.1209 13.0502 10.538 12.6205 10.1082C12.1907 9.67847 11.6078 9.43703 11 9.43703C10.3922 9.43703 9.80931 9.67847 9.37954 10.1082C8.94977 10.538 8.70833 11.1209 8.70833 11.7287C8.70833 12.3365 8.94977 12.9194 9.37954 13.3492C9.80931 13.7789 10.3922 14.0204 11 14.0204Z" fill="#222222"/> </g> <defs> <clipPath id="clip0_1_4192"> <rect width="22" height="22" fill="white" transform="translate(0 0.728699)"/> </clipPath> </defs> </svg>';
                  viewButton.addEventListener("click", () => {
                      alert(\`Viewing details for: \${row["Invoice #"]}\`);
                      location.href = \`single-page.html?id=\${row["Order Number"]}\`;
                  });
                  viewTd.appendChild(viewButton);
                  tr.appendChild(viewTd);

                  tableBody.appendChild(tr);
              });
          }

          // Drag-and-drop functionality for reordering list items
          let draggedItem = null;

          columns.addEventListener("dragstart", e => {
              if (e.target.tagName === "LI") {
                  draggedItem = e.target;
                  setTimeout(() => e.target.classList.add("hidden"), 0);
              }
          });

          columns.addEventListener("dragend", e => {
              if (e.target.tagName === "LI") {
                  e.target.classList.remove("hidden");
                  draggedItem = null;
              }
          });

          columns.addEventListener("dragover", e => {
              e.preventDefault();
              const closest = document.elementFromPoint(e.clientX, e.clientY);
              if (closest && closest.tagName === "LI" && closest !== draggedItem) {
                  const rect = closest.getBoundingClientRect();
                  const next = e.clientY > rect.top + rect.height / 2;
                  columns.insertBefore(draggedItem, next ? closest.nextSibling : closest);
              }
          });

          doneButton.addEventListener("click", updateTable);
      });
    `;
    document.body.appendChild(script);
  }, []);

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
					<a id="customize-btn" class="btn"><svg></svg>Customize Columns</a>
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
