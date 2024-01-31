import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import '../../components/style/myintroductions.css';

function MyIntroductions() {
  const [introductions, setIntroductions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const introductionsPerPage = 2;
  const accessToken = localStorage.getItem('Authorization');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(`https://api.ohmystack.co/api/user/all-introduces?page=${currentPage}`, config);
      setIntroductions(response.data);
    } catch (error) {
      console.error('Error fetching introductions:', error);
    }
  };

  const handleIntroductionClick = (id) => {
    navigate(`/mypage/myintroductions/detail/${id}`);
  };

  const handleWriteClick = () => {
    navigate('/mypage/writeintroduction');
  };

  const handleRepresentClick = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(`https://api.ohmystack.co/api/user/represent/${id}`, null, config);
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error('Error updating representation:', error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="content">
          <h1>자기소개서 목록</h1>
          <button onClick={handleWriteClick}>작성하기</button>
          <div className="introduction-container">
            {introductions.map((introduction) => (
              <div
                key={introduction.id}
                className={`introduction-box${introduction.represent ? ' represent' : ''}`}
              >
                <h2 onClick={() => handleIntroductionClick(introduction.id)}>{introduction.title}</h2>
                <p>작성일: {introduction.created_at}</p>
                <button onClick={() => handleRepresentClick(introduction.id)}>
                  {introduction.represent ? '대표 자기소개서 해제' : '대표 자기소개서로 지정'}
                </button>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              이전 페이지
            </button>
            <span>{currentPage}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              다음 페이지
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyIntroductions;
