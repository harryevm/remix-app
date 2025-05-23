import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
// import { fetchMongoData, totalPropertyCount, totalUserCount } from "../../services/mongoData.server";
import { fetchMongoData, totalPropertyCount, totalUserCount } from "../entry.server";




export const loader = async ({ request }) => {
  const admin = await authenticate.admin(request);
  

  if (!admin) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const [userCount, propertyCount, listingData] = await Promise.all([
    totalUserCount(),
    totalPropertyCount(),
    fetchMongoData(2)
  ]);

  return json({ admin, userCount, propertyCount, listingData });
};




export default function Index() {

  const { userCount, propertyCount, listingData } = useLoaderData();
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-info">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <div className="accounts">
              <a href="" className="notification"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.00002 0C5.27209 0 2.25002 3.02208 2.25002 6.75V10.3521L0.803551 13.9718C0.711226 14.2028 0.739485 14.4645 0.879015 14.6706C1.01856 14.8766 1.25118 15 1.5 15H6C6 16.6626 7.33746 18 9 18C10.6625 18 12 16.6626 12 15H16.5C16.7488 15 16.9815 14.8766 17.121 14.6706C17.2605 14.4645 17.2889 14.2028 17.1964 13.9718L15.75 10.3521V6.75C15.75 3.02208 12.728 0 9.00002 0ZM10.5 15C10.5 15.8342 9.83411 16.5 9 16.5C8.1659 16.5 7.5 15.8342 7.5 15H10.5ZM3.75002 6.75C3.75002 3.8505 6.10051 1.5 9.00002 1.5C11.8995 1.5 14.25 3.8505 14.25 6.75V10.4964C14.25 10.5917 14.2681 10.6862 14.3035 10.7747L15.3925 13.5H2.60739L3.69647 10.7747C3.73184 10.6862 3.75002 10.5917 3.75002 10.4964V6.75Z" fill="#222222"/> </svg></a>
              <a href="" className="profile"><img src="/images/icon.png" /></a>
            </div>
          </div>
                <div className="total-info">
                    <div className="total-boxes-wr">
                        <div className="total-box">
                            <div className="numbers">
                                <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"> <path d="M15.0018 1.875C15.5196 1.875 15.9393 2.29474 15.9393 2.8125V3.75H17.8125C19.3658 3.75 20.625 5.00919 20.625 6.5625V11.25H23.4375C24.9907 11.25 26.25 12.5092 26.25 14.0625V23.4375C26.25 24.9907 24.9907 26.25 23.4375 26.25H10.3125C10.3119 26.25 10.3131 26.25 10.3125 26.25H6.5625C5.00919 26.25 3.75 24.9907 3.75 23.4375V14.6126C3.75 13.6596 4.23268 12.7713 5.03237 12.2528L8.78237 9.82131C8.97469 9.6966 9.17334 9.59891 9.375 9.52641V6.5625C9.375 5.00919 10.6342 3.75 12.1875 3.75H14.0643V2.8125C14.0643 2.29474 14.4841 1.875 15.0018 1.875ZM11.25 9.52869C12.3039 9.90504 13.125 10.8957 13.125 12.1811V24.375H16.875V14.0625C16.875 12.8379 17.6576 11.7961 18.75 11.41V6.5625C18.75 6.04474 18.3303 5.625 17.8125 5.625H12.1875C11.6697 5.625 11.25 6.04474 11.25 6.5625V9.52869ZM19.6875 13.125C19.1698 13.125 18.75 13.5447 18.75 14.0625V24.375H23.4375C23.9552 24.375 24.375 23.9552 24.375 23.4375V14.0625C24.375 13.5447 23.9552 13.125 23.4375 13.125H19.6875ZM9.80246 11.3945L6.05246 13.826C5.78589 13.9989 5.625 14.295 5.625 14.6126V23.4375C5.625 23.9552 6.04474 24.375 6.5625 24.375H11.25V12.1811C11.25 11.4378 10.4262 10.9901 9.80246 11.3945Z" fill="white"/> </svg></div>
                                <div className="info">
                                    <span>Total Properties</span>
                                    <h5>{propertyCount}</h5>
                                </div>
                            </div>
                            {/* <div className="range">
                                <div class = "container"> <input type="range" className="rangeSlider" min="10" max="100" value="30" /> </div>
                                <label>increase <span>30</span>%</label>
                            </div> */}
                        </div>
                        <div className="total-box">
                            <div className="numbers">
                                <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"> <path d="M19.0848 15.7803C20.1685 14.9323 20.9596 13.7694 21.3478 12.4535C21.7361 11.1376 21.7023 9.73403 21.2512 8.4381C20.8 7.14217 19.9539 6.01831 18.8306 5.22288C17.7073 4.42745 16.3626 4 14.9836 4C13.6046 4 12.2599 4.42745 11.1366 5.22288C10.0133 6.01831 9.1672 7.14217 8.71604 8.4381C8.26488 9.73403 8.23109 11.1376 8.61937 12.4535C9.00765 13.7694 9.7987 14.9323 10.8825 15.7803C9.02541 16.5202 7.40508 17.7474 6.1942 19.3311C4.98331 20.9148 4.22727 22.7956 4.00667 24.7731C3.9907 24.9174 4.00348 25.0635 4.04428 25.203C4.08508 25.3424 4.1531 25.4725 4.24446 25.5859C4.42896 25.8147 4.69732 25.9613 4.9905 25.9934C5.28368 26.0254 5.57766 25.9404 5.80778 25.7569C6.03789 25.5734 6.18528 25.3065 6.21753 25.0149C6.46027 22.8659 7.49064 20.8811 9.11179 19.4398C10.7329 17.9985 12.8312 17.2018 15.0057 17.2018C17.1802 17.2018 19.2785 17.9985 20.8996 19.4398C22.5208 20.8811 23.5512 22.8659 23.7939 25.0149C23.8239 25.2851 23.9536 25.5345 24.1577 25.7152C24.3618 25.8959 24.626 25.995 24.8993 25.9934H25.0209C25.3107 25.9602 25.5755 25.8145 25.7578 25.588C25.94 25.3615 26.0248 25.0725 25.9937 24.7841C25.7721 22.801 25.0119 20.9154 23.7948 19.3292C22.5777 17.7431 20.9495 16.5163 19.0848 15.7803ZM14.9836 14.9997C14.1091 14.9997 13.2542 14.7418 12.527 14.2586C11.7999 13.7754 11.2331 13.0886 10.8985 12.2851C10.5638 11.4815 10.4762 10.5974 10.6468 9.74434C10.8175 8.89131 11.2386 8.10776 11.857 7.49276C12.4754 6.87776 13.2632 6.45895 14.121 6.28927C14.9787 6.11959 15.8678 6.20668 16.6757 6.53951C17.4837 6.87234 18.1743 7.43598 18.6601 8.15914C19.146 8.8823 19.4053 9.7325 19.4053 10.6022C19.4053 11.7685 18.9395 12.887 18.1102 13.7117C17.281 14.5364 16.1563 14.9997 14.9836 14.9997Z" fill="white"/> </svg></div>
                                <div className="info">
                                    <span>Customers</span>
                                    <h5>{userCount}</h5>
                                </div>
                            </div>
                            {/* <div className="range">
                                <div class = "container"> <input type="range" className="rangeSlider" min="10" max="100" value="70" /> </div>
                                <label>increase <span>70</span>%</label>
                            </div> */}
                        </div>
                    </div>
                </div>
          <div className="dashboard-content">
            <div className="heading-wr">
              <h2>Created Property </h2>
            </div>
            <div className="table">
                        <table>
                            <thead>
                                <tr id="table-header">
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Phone</th>
                                  <th>Address</th>
                                  <th>City</th>
                                  <th>Zip</th>
                                  <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="table-body">
                            {listingData.map((item, index) => (
                              <tr key={index} test={item}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.address}</td>
                                <td>{item.city}</td>
                                <td>{item.zip}</td>
                                <td><Link to={`/user/${item._id.toString()}`} className="view"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none"> <g clip-path="url(#clip0_1_4192)"> <path d="M11 3.4787C15.9427 3.4787 20.0548 7.03537 20.9174 11.7287C20.0557 16.422 15.9427 19.9787 11 19.9787C6.05733 19.9787 1.94516 16.422 1.08258 11.7287C1.94425 7.03537 6.05733 3.4787 11 3.4787ZM11 18.1454C12.8695 18.145 14.6835 17.51 16.1451 16.3443C17.6067 15.1786 18.6293 13.5513 19.0456 11.7287C18.6278 9.90756 17.6045 8.28204 16.1431 7.11789C14.6816 5.95374 12.8684 5.31985 11 5.31985C9.13155 5.31985 7.31838 5.95374 5.85693 7.11789C4.39547 8.28204 3.3722 9.90756 2.95441 11.7287C3.37067 13.5513 4.39328 15.1786 5.85488 16.3443C7.31648 17.51 9.13048 18.145 11 18.1454ZM11 15.8537C9.90598 15.8537 8.85677 15.4191 8.08318 14.6455C7.30959 13.8719 6.875 12.8227 6.875 11.7287C6.875 10.6347 7.30959 9.58547 8.08318 8.81188C8.85677 8.0383 9.90598 7.6037 11 7.6037C12.094 7.6037 13.1432 8.0383 13.9168 8.81188C14.6904 9.58547 15.125 10.6347 15.125 11.7287C15.125 12.8227 14.6904 13.8719 13.9168 14.6455C13.1432 15.4191 12.094 15.8537 11 15.8537ZM11 14.0204C11.6078 14.0204 12.1907 13.7789 12.6205 13.3492C13.0502 12.9194 13.2917 12.3365 13.2917 11.7287C13.2917 11.1209 13.0502 10.538 12.6205 10.1082C12.1907 9.67847 11.6078 9.43703 11 9.43703C10.3922 9.43703 9.80931 9.67847 9.37954 10.1082C8.94977 10.538 8.70833 11.1209 8.70833 11.7287C8.70833 12.3365 8.94977 12.9194 9.37954 13.3492C9.80931 13.7789 10.3922 14.0204 11 14.0204Z" fill="#222222"/> </g> <defs> <clipPath id="clip0_1_4192"> <rect width="22" height="22" fill="white" transform="translate(0 0.728699)"/> </clipPath> </defs> </svg></Link></td>
                              </tr>
                              ))}
                            </tbody>
                        </table>

                    </div>
          </div>
          <div className="footer">All Content &#169; NYFISBO. All Rights Reserved</div>
        </div>

      </div>
    </>
  );
}
