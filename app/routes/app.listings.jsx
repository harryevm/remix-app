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



export default function ListingPage() {
  // const { connected, message } = useLoaderData();
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "email",
    "phone",
    "address",
    "city",
    "zip",
    "property-type",
    "home-size",
    "year-built",
    "bedrooms"
  ]);
  const [checkboxState, setCheckboxState] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // Toggle the visibility state
  };

  useEffect(() => {
    const hiddenColumns = ["property-type", "home-size", "year-built", "bedrooms"];
    const filteredColumns = visibleColumns.filter(col => !hiddenColumns.includes(col));
    setVisibleColumns(filteredColumns);
    // Initialize checkbox state based on visible columns
    const initialState = visibleColumns.reduce((acc, col) => {
      acc[col] = !hiddenColumns.includes(col);
      return acc;
    }, {});
    setCheckboxState(initialState);
  }, []);

  console.log(visibleColumns)

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setCheckboxState((prev) => ({ ...prev, [value]: checked }));
  };

  const handleDoneClick = () => {
    const selectedColumns = Object.keys(checkboxState).filter((key) => checkboxState[key]);
    setVisibleColumns(selectedColumns);
    setIsVisible(false); // Close modal after confirming
  };

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("https://remix-app-88og.onrender.com/api/getdata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
           <div class="dashboard">
	
    <div class="sidebar">
        <a href=""><h1>NYFISBO</h1></a>
        <ul class="menu">
            <li id="index-link"><a href="index.html"><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0 3.5194C0 1.67845 1.49239 0.186066 3.33333 0.186066H12.6667C14.5076 0.186066 16 1.67845 16 3.5194V12.8527C16 14.6937 14.5076 16.1861 12.6667 16.1861H3.33333C1.49239 16.1861 0 14.6937 0 12.8527V3.5194ZM3.33333 1.5194C2.22876 1.5194 1.33333 2.41483 1.33333 3.5194V4.18607H7.33333V1.5194H3.33333ZM8.66667 1.5194V10.8527H14.6667V3.5194C14.6667 2.41483 13.7712 1.5194 12.6667 1.5194H8.66667ZM14.6667 12.1861H8.66667V14.8527H12.6667C13.7712 14.8527 14.6667 13.9573 14.6667 12.8527V12.1861ZM7.33333 14.8527V5.5194H1.33333V12.8527C1.33333 13.9573 2.22876 14.8527 3.33333 14.8527H7.33333Z" fill="#222222"/> </svg>Dashboard</a></li>
            <li id="listing-link" ><a href="listing.html"><svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.29035 0.686096C9.70456 0.686096 10.0403 1.02189 10.0403 1.4361V2.1861H11.5389C12.7815 2.1861 13.7889 3.19345 13.7889 4.4361V8.1861H16.0389C17.2815 8.1861 18.2889 9.19345 18.2889 10.4361V17.9361C18.2889 19.1787 17.2815 20.1861 16.0389 20.1861H5.53888C5.53838 20.1861 5.53937 20.1861 5.53888 20.1861H2.53888C1.29623 20.1861 0.288879 19.1787 0.288879 17.9361V10.8762C0.288879 10.1137 0.675024 9.40315 1.31477 8.98834L4.31477 7.04314C4.46863 6.94338 4.62755 6.86523 4.78888 6.80722V4.4361C4.78888 3.19345 5.79623 2.1861 7.03888 2.1861H8.54035V1.4361C8.54035 1.02189 8.87613 0.686096 9.29035 0.686096ZM6.28888 6.80905C7.13203 7.11013 7.78888 7.90269 7.78888 8.93101V18.6861H10.7889V10.4361C10.7889 9.45643 11.415 8.623 12.2889 8.31412V4.4361C12.2889 4.02189 11.9531 3.6861 11.5389 3.6861H7.03888C6.62467 3.6861 6.28888 4.02189 6.28888 4.4361V6.80905ZM13.0389 9.6861C12.6247 9.6861 12.2889 10.0219 12.2889 10.4361V18.6861H16.0389C16.453 18.6861 16.7889 18.3502 16.7889 17.9361V10.4361C16.7889 10.0219 16.453 9.6861 16.0389 9.6861H13.0389ZM5.13085 8.30172L2.13085 10.2469C1.91759 10.3852 1.78888 10.6221 1.78888 10.8762V17.9361C1.78888 18.3502 2.12467 18.6861 2.53888 18.6861H6.28888V8.93101C6.28888 8.33632 5.62982 7.97818 5.13085 8.30172Z" fill="#222222"/> </svg>Property Listing</a></li>
        </ul>
    </div>
    <div class="dashboard-info">
        <div class="dashboard-header">
            <h2>Dashboard</h2>
            <div class="accounts">
                <a href="" class="notification"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.00002 0C5.27209 0 2.25002 3.02208 2.25002 6.75V10.3521L0.803551 13.9718C0.711226 14.2028 0.739485 14.4645 0.879015 14.6706C1.01856 14.8766 1.25118 15 1.5 15H6C6 16.6626 7.33746 18 9 18C10.6625 18 12 16.6626 12 15H16.5C16.7488 15 16.9815 14.8766 17.121 14.6706C17.2605 14.4645 17.2889 14.2028 17.1964 13.9718L15.75 10.3521V6.75C15.75 3.02208 12.728 0 9.00002 0ZM10.5 15C10.5 15.8342 9.83411 16.5 9 16.5C8.1659 16.5 7.5 15.8342 7.5 15H10.5ZM3.75002 6.75C3.75002 3.8505 6.10051 1.5 9.00002 1.5C11.8995 1.5 14.25 3.8505 14.25 6.75V10.4964C14.25 10.5917 14.2681 10.6862 14.3035 10.7747L15.3925 13.5H2.60739L3.69647 10.7747C3.73184 10.6862 3.75002 10.5917 3.75002 10.4964V6.75Z" fill="#222222"/> </svg></a>
                <a href="" class="profile"><img src="icon.png" /></a>
            </div>
        </div>
        <div class="dashboard-content">
            <div class="heading-wr">
                <h2>Property Listening</h2>
                <a id="customize-btn" class="btn" onClick={toggleVisibility}><svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.5 8.9787C8.5 8.56449 8.8358 8.2287 9.25 8.2287H12.75C13.1642 8.2287 13.5 8.56449 13.5 8.9787C13.5 9.3929 13.1642 9.7287 12.75 9.7287H9.25C8.8358 9.7287 8.5 9.3929 8.5 8.9787ZM9.2501 13.7287C8.8358 13.7287 8.5001 14.0645 8.5001 14.4787C8.5001 14.8929 8.8358 15.2287 9.2501 15.2287H12.7499C13.1642 15.2287 13.4999 14.8929 13.4999 14.4787C13.4999 14.0645 13.1642 13.7287 12.7499 13.7287H9.2501ZM6.7803 8.50903C7.0732 8.21614 7.0732 7.74126 6.7803 7.44837C6.4874 7.15548 6.0126 7.15548 5.71967 7.44837L4.25 8.918L3.78033 8.44837C3.48744 8.15548 3.01256 8.15548 2.71967 8.44837C2.42678 8.7413 2.42678 9.2161 2.71967 9.509L3.71967 10.509C4.01256 10.8019 4.48744 10.8019 4.78033 10.509L6.7803 8.50903ZM6.7803 12.9484C7.0732 13.2413 7.0732 13.7161 6.7803 14.009L4.78033 16.009C4.48744 16.3019 4.01256 16.3019 3.71967 16.009L2.71967 15.009C2.42678 14.7161 2.42678 14.2413 2.71967 13.9484C3.01256 13.6555 3.48744 13.6555 3.78033 13.9484L4.25 14.418L5.71967 12.9484C6.0126 12.6555 6.4874 12.6555 6.7803 12.9484ZM11.994 2.81319C11.9093 1.64783 10.937 0.728699 9.75 0.728699H6.25C5.09205 0.728699 4.13841 1.60342 4.01379 2.72814L2.25 2.7287C1.00736 2.7287 0 3.73606 0 4.9787V18.4787C0 19.7213 1.00736 20.7287 2.25 20.7287H13.75C14.9926 20.7287 16 19.7213 16 18.4787V4.9787C16 3.73606 14.9926 2.7287 13.75 2.7287L11.9862 2.72814C11.9893 2.75634 11.9919 2.78469 11.994 2.81319ZM11.9948 2.82465L12 2.9787C12 2.92692 11.9983 2.87555 11.9948 2.82465ZM6.25 5.2287H9.75C10.53 5.2287 11.2174 4.83177 11.621 4.22886L13.75 4.2287C14.1642 4.2287 14.5 4.56449 14.5 4.9787V18.4787C14.5 18.8929 14.1642 19.2287 13.75 19.2287H2.25C1.83579 19.2287 1.5 18.8929 1.5 18.4787V4.9787C1.5 4.56449 1.83579 4.2287 2.25 4.2287L4.37902 4.2289C4.78267 4.8318 5.46997 5.2287 6.25 5.2287ZM6.25 2.2287H9.75C10.1642 2.2287 10.5 2.56449 10.5 2.9787C10.5 3.39291 10.1642 3.7287 9.75 3.7287H6.25C5.83579 3.7287 5.5 3.39291 5.5 2.9787C5.5 2.56449 5.83579 2.2287 6.25 2.2287Z" fill="#222222"/> </svg>Customize Columns</a>
                <div class="columns" style={{ display: isVisible ? "block" : "none" }}>
                    <h5>Columns</h5>
                    <ul id="columns">
                      {Object.keys(checkboxState).map((column) => (
                        <li key={column} draggable="true">
                          <input
                            type="checkbox"
                            value={column}
                            checked={checkboxState[column]}
                            onChange={handleCheckboxChange}
                          />{" "}
                          {column}
                        </li>
                      ))}
                    </ul>
                    <button className="btn" id="done-button" onClick={handleDoneClick}>
                      Done
                    </button>
                </div>
            </div>
            <div class="table">
                <table>
                    <thead>
                    <tr id="table-header">
                      {visibleColumns.map((col) => (
                        <th key={col}>{col.replace("-", " ")}</th>
                      ))}
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody id="table-body">
                    {sampleData.map((item, index) => (
                        <tr key={index}>
                          {visibleColumns.map((col) => (
                            <td key={col}>{item[col]}</td>
                          ))}
                          <td>
                            <button>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>

            </div>
        </div>
        <div class="footer">All Content &#169; NYFISBO. All Rights Reserved</div>
    </div>

</div>
    </>
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
