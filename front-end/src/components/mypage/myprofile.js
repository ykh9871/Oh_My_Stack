import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import '../../components/style/mystack.css';
import '../../components/style/myprofile.css';


function MyProfile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await axios.get('https://api.ohmystack.co/api/user/userinfo', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserInfo(response.data.body);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="myedit_content">
          <h3 className='userinfo'>회원 정보</h3>
          {userInfo && (
            <div className='p_profile'>
              <div className='text-profile'>
                <p><strong>Nick Name :</strong> <span style={{ fontStyle: "italic" }}>{userInfo.nickName}</span></p>
                <p><strong>Phone Number :</strong> <span style={{ fontStyle: "italic" }}>{userInfo.phoneNumber}</span></p>
                <p><strong>Academic Ability :</strong> <span style={{ fontStyle: "italic" }}>{userInfo.academicAbility.title}</span></p>
                <p><strong>Department :</strong> <span style={{ fontStyle: "italic" }}>{userInfo.department.title}</span></p>
                <p><strong>Address :</strong> <span style={{ fontStyle: "italic" }}>{userInfo.userAddress}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyProfile;
