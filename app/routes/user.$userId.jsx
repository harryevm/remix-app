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
            <p><b>Created Date: </b> {data.createdAt}</p>
            <div className="detail-box">
              <h3>Location</h3>
              <div className="box">
                <div className="data-box">
                  <h5>Address Line1</h5>
                  <div class="data-wr">
                    <p>{data.address}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Address Line2</h5>
                  <div class="data-wr">
                    <p>{data.address2}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>City</h5>
                  <div class="data-wr">
                    <p>{data.city}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>State</h5>
                  <div class="data-wr">
                    <p>New York</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Zip Code</h5>
                  <div class="data-wr">
                    <p>{data.zip}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Neighborhood</h5>
                  <div class="data-wr">
                    <p>{data.neighborhood}</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="detail-box">
              <h3>Home Details</h3>
              <div className="box">
                <div className="data-box">
                  <h5>Property Type</h5>
                  <div class="data-wr">
                    <p>{data['property-type']}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Home Size</h5>
                  <div class="data-wr">
                    <p>{data['home-size']}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Lot Size</h5>
                  <div class="data-wr">
                    <p>{data['lot-size']+data['lot-unit']}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Year Built</h5>
                  <div class="data-wr">
                    <p>{data['year-built']}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Bedrooms</h5>
                  <div class="data-wr">
                    <p>{data.bedrooms}</p>
                  </div>
                </div>
                <div className="data-box">
                  <h5>Bathrooms</h5>
                  <div class="data-wr">
                    <p>{data.bathrooms}</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="detail-box utilies_feature">
              <h3>Utilities & Features</h3>
              <div className="box">
                <div className="info">
                  <h4>Utilities</h4>
                  <ul>
                    <li><b>Heating Type:</b> {data.heating}</li>
                    <li><b>Cooling Type:</b> {data.cooling}</li>
                    <li><b>Water Source:</b> {data.waterSource}</li>
                    <li><b>Sewer Type:</b> {data.sewer}</li>
                    <li><b>Other Utilities:</b> {data.otherUtilities}</li>
                  </ul>
                </div>
                <div className="info">
                  <h4>Features</h4>
                  <ul>
                    <li><b>Garage:</b> {data.garage}</li>
                    {data.garage === "yes" && <li><b>Garage:</b> {data["garage-specify"]}</li>}
                    <li><b>Basement:</b> {data.basement} </li>
                    <li><b>Outdoor Features:</b> {data.outdoorFeatures}</li>
                    <li><b>Additional Features:</b> {data.additionalFeatures}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="detail-box media_release">
              <h3>Photos and Media Release:</h3>
              <div className="box">
                <div className="data-box">
                  <p><b>I grant permission for the use of images taken of the property.:</b> {data.listingCheckbox ? 'Yes' : 'No'}</p>
                </div>
                <div className="data-box">
                  <p><b>Media Release Signature: </b>{data.mediaRelease}</p>
                </div>
                <div className="data-box">
                  <p><b>Date: </b>{data.mediaReleaseDate}</p>
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

            <div className="detail-box">
              <h3>Property Description :</h3>
              <div className="box">
                <p>{data.description}</p>
              </div>
            </div>
            <div className="detail-box">
              <h3>Asking Price :</h3>
              <div className="box">
                <p>{data.askingPrice}</p>
              </div>
            </div>
            <div className="detail-box contact_information">
              <h3>Contact Information :</h3>
              <div className="box">
                <p><b>Preferred Contact Method:</b> {data.preferredContact}</p>
                <p><b>Contact Hours:</b> {data.contactHours}</p>
              </div>
            </div>

            <div className="detail-box agreements_block">
              <h3>Agreements:</h3>
              <div className="box">
                <h4>1. Agency Representation Agreement</h4>
                <div className="data-box">
                  <p><b>I confirm that I have signed this document.:</b> {data.agencyCheckbox ? 'Yes' : 'No'}</p>
                </div>
                <div className="data-box">
                  <p><b>Signature:</b> {data.agencySignature}</p>
                </div>
                <div className="data-box">
                  <p><b>Date:</b> {data.agencyDate}</p>
                </div>
                <div className="data-box">
                  <p><b>Agreement image/docx:</b> <Link to={data.agencyAgreement[0]} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="60px" height="60px">    <path d="M24.707,8.793l-6.5-6.5C18.019,2.105,17.765,2,17.5,2H7C5.895,2,5,2.895,5,4v22c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2 V9.5C25,9.235,24.895,8.981,24.707,8.793z M18,10c-0.552,0-1-0.448-1-1V3.904L23.096,10H18z"/></svg></Link></p>
                </div>
              </div>

              <div className="box">
                <h4>2. Fair Housing Disclosure Form</h4>
                <div className="data-box">
                  <p><b>I confirm that I have signed this document.:</b> {data.fairHousingCheckbox ? 'Yes' : 'No'}</p>
                </div>
                <div className="data-box">
                  <p><b>Signature:</b> {data.fairHousingSignature}</p>
                </div>
                <div className="data-box">
                  <p><b>Date:</b> {data.fairHousingDate}</p>
                </div>
                <div className="data-box">
                  <p><b>Agreement image/docx:</b> <Link to={data.fairHousing[0]} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="60px" height="60px">    <path d="M24.707,8.793l-6.5-6.5C18.019,2.105,17.765,2,17.5,2H7C5.895,2,5,2.895,5,4v22c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2 V9.5C25,9.235,24.895,8.981,24.707,8.793z M18,10c-0.552,0-1-0.448-1-1V3.904L23.096,10H18z"/></svg></Link></p>
                </div>
              </div>

              <div className="box">
                <h4>3. Property Disclosure Statement</h4>
                <div className="data-box">
                  <p><b>I confirm that I have signed this document.:</b> {data.propertyCheckbox ? 'Yes' : 'No'}</p>
                </div>
                <div className="data-box">
                  <p><b>Signature:</b> {data.propertySignature}</p>
                </div>
                <div className="data-box">
                  <p><b>Date:</b> {data.propertyDate}</p>
                </div>
                <div className="data-box">
                  <p><b>Agreement image/docx:</b> <Link to={data.propertyDisclosure[0]} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="60px" height="60px">    <path d="M24.707,8.793l-6.5-6.5C18.019,2.105,17.765,2,17.5,2H7C5.895,2,5,2.895,5,4v22c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2 V9.5C25,9.235,24.895,8.981,24.707,8.793z M18,10c-0.552,0-1-0.448-1-1V3.904L23.096,10H18z"/></svg></Link></p>
                </div>
              </div>

              <div className="box">
                <h4>4. Listing Agreement</h4>
                <div className="data-box">
                  <p><b>I confirm that I have signed this document.:</b> {data.listingAgreementCheck ? 'Yes' : 'No'}</p>
                </div>
                <div className="data-box">
                  <p><b>Signature:</b> {data.listingSignature}</p>
                </div>
                <div className="data-box">
                  <p><b>Date:</b> {data.listingDate}</p>
                </div>
                <div className="data-box">
                  <p><b>Agreement image/docx:</b> <Link to={data.listingAgreement[0]} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="60px" height="60px">    <path d="M24.707,8.793l-6.5-6.5C18.019,2.105,17.765,2,17.5,2H7C5.895,2,5,2.895,5,4v22c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2 V9.5C25,9.235,24.895,8.981,24.707,8.793z M18,10c-0.552,0-1-0.448-1-1V3.904L23.096,10H18z"/></svg></Link></p>
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
