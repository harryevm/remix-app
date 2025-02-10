import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";

import { useLoaderData } from '@remix-run/react';
import { fetchMongoDataById } from '../entry.server';


export const loader = async ({ params }) => {
  const { userId } = params; // `params` already contains userId from the URL

  console.log('Fetching user with ID:', userId);

  const data = await fetchMongoDataById(userId); // Use the userId here
  
  if (!data) {
    throw new Response('Item not found', { status: 404 });
  }else{
    console.log('Error Hai')
  }

  return { data };
};

export default function ItemPage() {
  const { data } = useLoaderData();

  return (
    <>
     <div className="dashboard">
      <div className="sidebar">
        <a href=""><h1>NYFISBO</h1></a>
        <ul className="menu">
          <li id="index-link"><a href="index.html"><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0 3.5194C0 1.67845 1.49239 0.186066 3.33333 0.186066H12.6667C14.5076 0.186066 16 1.67845 16 3.5194V12.8527C16 14.6937 14.5076 16.1861 12.6667 16.1861H3.33333C1.49239 16.1861 0 14.6937 0 12.8527V3.5194ZM3.33333 1.5194C2.22876 1.5194 1.33333 2.41483 1.33333 3.5194V4.18607H7.33333V1.5194H3.33333ZM8.66667 1.5194V10.8527H14.6667V3.5194C14.6667 2.41483 13.7712 1.5194 12.6667 1.5194H8.66667ZM14.6667 12.1861H8.66667V14.8527H12.6667C13.7712 14.8527 14.6667 13.9573 14.6667 12.8527V12.1861ZM7.33333 14.8527V5.5194H1.33333V12.8527C1.33333 13.9573 2.22876 14.8527 3.33333 14.8527H7.33333Z" fill="#222222"/> </svg>Dashboard</a></li>
          <li id="listing-link" ><a href="listing.html"><svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.29035 0.686096C9.70456 0.686096 10.0403 1.02189 10.0403 1.4361V2.1861H11.5389C12.7815 2.1861 13.7889 3.19345 13.7889 4.4361V8.1861H16.0389C17.2815 8.1861 18.2889 9.19345 18.2889 10.4361V17.9361C18.2889 19.1787 17.2815 20.1861 16.0389 20.1861H5.53888C5.53838 20.1861 5.53937 20.1861 5.53888 20.1861H2.53888C1.29623 20.1861 0.288879 19.1787 0.288879 17.9361V10.8762C0.288879 10.1137 0.675024 9.40315 1.31477 8.98834L4.31477 7.04314C4.46863 6.94338 4.62755 6.86523 4.78888 6.80722V4.4361C4.78888 3.19345 5.79623 2.1861 7.03888 2.1861H8.54035V1.4361C8.54035 1.02189 8.87613 0.686096 9.29035 0.686096ZM6.28888 6.80905C7.13203 7.11013 7.78888 7.90269 7.78888 8.93101V18.6861H10.7889V10.4361C10.7889 9.45643 11.415 8.623 12.2889 8.31412V4.4361C12.2889 4.02189 11.9531 3.6861 11.5389 3.6861H7.03888C6.62467 3.6861 6.28888 4.02189 6.28888 4.4361V6.80905ZM13.0389 9.6861C12.6247 9.6861 12.2889 10.0219 12.2889 10.4361V18.6861H16.0389C16.453 18.6861 16.7889 18.3502 16.7889 17.9361V10.4361C16.7889 10.0219 16.453 9.6861 16.0389 9.6861H13.0389ZM5.13085 8.30172L2.13085 10.2469C1.91759 10.3852 1.78888 10.6221 1.78888 10.8762V17.9361C1.78888 18.3502 2.12467 18.6861 2.53888 18.6861H6.28888V8.93101C6.28888 8.33632 5.62982 7.97818 5.13085 8.30172Z" fill="#222222"/> </svg>Property Listing</a></li>
        </ul>
      </div>
      <div className="dashboard-info">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="accounts">
            <a href="" className="notification"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.00002 0C5.27209 0 2.25002 3.02208 2.25002 6.75V10.3521L0.803551 13.9718C0.711226 14.2028 0.739485 14.4645 0.879015 14.6706C1.01856 14.8766 1.25118 15 1.5 15H6C6 16.6626 7.33746 18 9 18C10.6625 18 12 16.6626 12 15H16.5C16.7488 15 16.9815 14.8766 17.121 14.6706C17.2605 14.4645 17.2889 14.2028 17.1964 13.9718L15.75 10.3521V6.75C15.75 3.02208 12.728 0 9.00002 0ZM10.5 15C10.5 15.8342 9.83411 16.5 9 16.5C8.1659 16.5 7.5 15.8342 7.5 15H10.5ZM3.75002 6.75C3.75002 3.8505 6.10051 1.5 9.00002 1.5C11.8995 1.5 14.25 3.8505 14.25 6.75V10.4964C14.25 10.5917 14.2681 10.6862 14.3035 10.7747L15.3925 13.5H2.60739L3.69647 10.7747C3.73184 10.6862 3.75002 10.5917 3.75002 10.4964V6.75Z" fill="#222222"/> </svg></a>
            <a href="" className="profile"><img src="icon.png" /></a>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="heading-wr">
            <h2>Property Name</h2>
          </div>
          <div className="detials_wrapper">
            <div className="detail-box">
              <h3>Location</h3>
              <div className="box">
                <div className="form-control">
                  <label>Address Line1</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Address Line2</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>City</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>State</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Zip Code</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>

              </div>
            </div>

            <div className="detail-box">
              <h3>Home Details</h3>
              <div className="box">
                <div className="form-control">
                  <label>Property Type</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Home Size</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Lot Size</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Year Built</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Bedrooms</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>
                <div className="form-control">
                  <label>Bathrooms</label>
                  <input type="text" name="address1" value="25 New street" />
                </div>

              </div>
            </div>

            <div className="detail-box utilies_feature">
              <h3>Utilities & Features</h3>
              <div className="box">
                <div className="info">
                  <h4>Appliances</h4>
                  <ul>
                    <li>Dishwasher</li>
                    <li>Garbage Disposal</li>
                    <li>Refrigerator </li>
                    <li>Microwave</li>
                  </ul>
                </div>
                <div className="info">
                  <h4>Floors</h4>
                  <ul>
                    <li>Carpet </li>
                    <li>Laminate </li>
                    <li>Softwood  </li>
                    <li>Linoleum-Vinyl</li>
                  </ul>
                </div>
                <div className="info">
                  <h4>Others</h4>
                  <ul>
                    <li>Security Systems </li>
                    <li>Patio/Balconyl </li>
                    <li>Central Heating  </li>
                    <li>Spa/Jacuzzi</li>
                  </ul>
                </div>
                <div className="info">
                  <h4>Parking</h4>
                  <ul>
                    <li>Carport </li>
                    <li>Garage Detached </li>
                    <li>Garage Attached  </li>
                    <li>On Street</li>
                  </ul>
                </div>
                <div className="info">
                  <h4>Rooms</h4>
                  <ul>
                    <li>Breakfast Nook </li>
                    <li>Recreation Room </li>
                    <li>Solarium-Atrium  </li>
                    <li>Laundry Room</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="detail-box photos">
              <h3>Photos</h3>
              <div className="photos-wr">
                <div className="img-box">
                  <img src="img.png" alt="" />
                </div>
                <div className="img-box">
                  <img src="img.png" alt="" />
                </div>
                <div className="img-box">
                  <img src="img.png" alt="" />
                </div>
                <div className="img-box">
                  <img src="img.png" alt="" />
                </div>
                <div className="img-box">
                  <img src="img.png" alt="" />
                </div>
              </div>
            </div>

            <div className="detail-box videos">
              <h3>Videos</h3>
              <div className="videos-wr">
                <!-- <div className="video-box">
                  <video></video>
                </div>
                <div className="video-box">
                  <video></video>
                </div>
                <div className="video-box">
                  <video></video>
                </div>
                <div className="video-box">
                  <video></video>
                </div> -->
                <div className="video-box">
                  <img src="video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="video.png" alt="" />
                </div>
              </div>
            </div>



          </div>
          
        </div>
        <div className="footer">All Content &#169; NYFISBO. All Rights Reserved</div>
      </div>

    </div>
    </>
  );
}
