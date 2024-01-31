import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import MyStackBox from './mystackbox';
import '../../components/style/mystack.css';

function Mystack() {
  const [stacks, setStacks] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await axios.get('https://api.ohmystack.co/api/user/stacks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStacks(response.data);
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
        <div className="content">
          <h1>나의 기술 스택</h1>
          <div className="mystack-container">
            {stacks.map((stack) => (
              <MyStackBox
                key={stack.id}
                stack={stack}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Mystack;
