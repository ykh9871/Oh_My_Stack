import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import '../../components/style/introduction_edit.css';

function IntroductionEdit() {
  const [title, setTitle] = useState('');
  const [introduce, setIntroduce] = useState('');
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
      setTitle(response.data.title);
      setIntroduce(response.data.introduce);
    } catch (error) {
      console.error('Error fetching introduction:', error);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleIntroduceChange = (event) => {
    setIntroduce(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    const body = {
      title,
      introduce,
    };

    try {
      await axios.put(`https://api.ohmystack.co/api/user/introduce/${id}`, body, config);
      navigate(`/mypage/myintroductions/detail/${id}`);
    } catch (error) {
      console.error('Error updating introduction:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="content">
          <h1>자기소개서 수정</h1>
          <form onSubmit={handleSubmit}>
            <label>
              제목:
              <input type="text" value={title} onChange={handleTitleChange} />
            </label>
            <label>
              내용:
              <textarea value={introduce} onChange={handleIntroduceChange} />
            </label>
            <input type="submit" value="수정하기" />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default IntroductionEdit;
