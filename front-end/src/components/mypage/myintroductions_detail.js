import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import '../../components/style/myintroduction_detail.css';

function IntroductionDetail() {
  const [introduction, setIntroduction] = useState(null);
  const accessToken = localStorage.getItem('Authorization');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.ohmystack.co/api/user/introduce/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIntroduction(response.data);
    } catch (error) {
      console.error('Error fetching introduction:', error);
    }
  };

  const handleEditClick = () => {
    navigate(`/mypage/myintroductions/edit/${id}`);
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`https://api.ohmystack.co/api/user/introduce/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate('/mypage/myintroductions');
    } catch (error) {
      console.error('Error deleting introduction:', error);
    }
  };

  if (!introduction) {
    return null; // You can show a loading indicator or message here while fetching the data
  }

  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="content">
          <h1>자기소개서 상세</h1>
          <div className="introduction-details">
            <div className="box">
              <h2>{introduction.title}</h2>
            </div>
            <div className="box">
              <p>{introduction.introduce}</p>
            </div>
            <div className="box">
              <p>작성일: {introduction.created_at}</p>
            </div>
            <button onClick={handleEditClick}>수정</button>
            <button onClick={handleDeleteClick}>삭제</button>  // 삭제 버튼을 추가합니다.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default IntroductionDetail;
