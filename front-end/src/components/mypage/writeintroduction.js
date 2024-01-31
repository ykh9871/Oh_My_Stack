import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import '../../components/style/writeintroduction.css';

function WriteIntroduction() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const accessToken = localStorage.getItem('Authorization');
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = JSON.stringify({
      "title": title,
      "introduce": content,
    });

    const config = {
      method: 'post',
      url: 'https://api.ohmystack.co/api/user/introduce-save',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${accessToken}`
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      navigate('/mypage/myintroductions'); // redirect user to my introductions page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className='mypage-container'>
        <MySidebar />
        <div>
        </div>
        <div>
          <h1>자기소개서 작성하기</h1>
          <div> {/* Wrap form in a div for styling */}
            <form onSubmit={handleSubmit}>
              <label>
                제목:
                <input type="text" value={title} onChange={handleTitleChange} />
              </label>
              <label>
                내용:
                <textarea value={content} onChange={handleContentChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default WriteIntroduction;
