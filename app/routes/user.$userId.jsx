import { Link, useLoaderData } from '@remix-run/react';
import { fetchMongoDataById } from '../entry.server';



export const loader = async ({ params }) => {
  const { userId } = params; 

  const data = await fetchMongoDataById(userId); // Use the userId here
  
  if (!data) {
    throw new Response('Item not found', { status: 404 });
  }

  return { data };
};

export default function ItemPage() {
  const { data } = useLoaderData(); 
  return (
    <>
      <div className="dashboard">

      <div className="dashboard-info">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="accounts">
            <a href="" className="notification"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.00002 0C5.27209 0 2.25002 3.02208 2.25002 6.75V10.3521L0.803551 13.9718C0.711226 14.2028 0.739485 14.4645 0.879015 14.6706C1.01856 14.8766 1.25118 15 1.5 15H6C6 16.6626 7.33746 18 9 18C10.6625 18 12 16.6626 12 15H16.5C16.7488 15 16.9815 14.8766 17.121 14.6706C17.2605 14.4645 17.2889 14.2028 17.1964 13.9718L15.75 10.3521V6.75C15.75 3.02208 12.728 0 9.00002 0ZM10.5 15C10.5 15.8342 9.83411 16.5 9 16.5C8.1659 16.5 7.5 15.8342 7.5 15H10.5ZM3.75002 6.75C3.75002 3.8505 6.10051 1.5 9.00002 1.5C11.8995 1.5 14.25 3.8505 14.25 6.75V10.4964C14.25 10.5917 14.2681 10.6862 14.3035 10.7747L15.3925 13.5H2.60739L3.69647 10.7747C3.73184 10.6862 3.75002 10.5917 3.75002 10.4964V6.75Z" fill="#222222"/> </svg></a>
            <a href="" class="profile"><img src="/images/icon.png" /></a>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="heading-wr">
            <h2>Property Name</h2>
            <Link to="/app/listings">Back To Listings</Link>
          </div>
          <div className="detials_wrapper">
            <div className="detail-box">
              <h3>Location</h3>
              <div className="box">
                <div className="form-control">
                  <label>Address Line1</label>
                  <input type="text" name="address1" value={data.address} />
                </div>
                <div className="form-control">
                  <label>Address Line2</label>
                  <input type="text" name="address1" value={data.address2} />
                </div>
                <div className="form-control">
                  <label>City</label>
                  <input type="text" name="address1" value={data.city} />
                </div>
                <div className="form-control">
                  <label>State</label>
                  <input type="text" name="address1" value='New York' />
                </div>
                <div className="form-control">
                  <label>Zip Code</label>
                  <input type="text" name="address1" value={data.zip} />
                </div>

              </div>
            </div>

            <div className="detail-box">
              <h3>Home Details</h3>
              <div className="box">
                <div className="form-control">
                  <label>Property Type</label>
                  <input type="text" name="address1" value={data['property-type']} />
                </div>
                <div className="form-control">
                  <label>Home Size</label>
                  <input type="text" name="address1" value={data['home-size']} />
                </div>
                <div className="form-control">
                  <label>Lot Size</label>
                  <input type="text" name="address1" value={data['lot-size']+data['lot-unit']} />
                </div>
                <div className="form-control">
                  <label>Year Built</label>
                  <input type="text" name="address1" value={data['year-built']} />
                </div>
                <div className="form-control">
                  <label>Bedrooms</label>
                  <input type="text" name="address1" value={data.bedrooms} />
                </div>
                <div className="form-control">
                  <label>Bathrooms</label>
                  <input type="text" name="address1" value={data.bathrooms} />
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
              {data.propertyPhotos && data.propertyPhotos.map((item, index) => (
                <div key={index} className="img-box">
                  <img src={item} alt="property photo" />
                </div>
              ))}
              </div>
            </div>

            <div className="detail-box videos">
              <h3>Videos</h3>
              <div className="videos-wr">
                
                <div className="video-box">
                  <img src="/images/placeholder-video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="/images/placeholder-video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="/images/placeholder-video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="/images/placeholder-video.png" alt="" />
                </div>
                <div className="video-box">
                  <img src="/images/placeholder-video.png" alt="" />
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
