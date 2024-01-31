import React, { useState } from 'react';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import axios from 'axios';
import '../../components/style/mystack.css';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const data = {
      currentPassword,
      newPassword
    };

    const token = localStorage.getItem('Authorization');

    axios.put('https://api.ohmystack.co/api/user/change-password', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
    })
    .catch((error) => {
      console.log(error);
      setMessage('비밀번호 변경에 실패했습니다.');
    });
  };

  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="content">
          <h1>비밀번호 변경</h1>
          <form onSubmit={handleSubmit}>
            <label>
              현재 비밀번호:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
            <label>
              새 비밀번호:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              새 비밀번호 확인:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <button type="submit">비밀번호 변경</button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChangePassword;
