import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import '../../components/style/searchpassword.css';
import Header from '../../components/base/header';
import axios from 'axios';

function SearchPassword() {
  const [userNumber, setUserNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [validatedToken, setValidatedToken] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const navigate = useNavigate();

  const sendEmail = () => {
    const data = {
      phoneNumber: userNumber,
      email: userId
    };

    setSendingEmail(true);

    axios
      .post('https://api.ohmystack.co/api/find-password', data)
      .then((response) => {
        console.log('인증메일이 전송되었습니다: ', response.data);
        alert('인증메일 전송. 이메일을 확인해주세요.');
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setSendingEmail(false);
      });
  };

  const validateToken = () => {
    const data = {
      token: token
    };

    axios
      .post('https://api.ohmystack.co/api/validate-token', data)
      .then((response) => {
        console.log('토큰 인증이 완료되었습니다: ', response.data);
        alert('토큰인증 완료. 이제 비밀번호를 변경해주세요.');
        setValidatedToken(token);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resetPassword = () => {
    if (!validatedToken) {
      alert('인증이 완료되지 않았습니다. 인증을 먼저 진행해주세요.');
      return;
    }

    const data = {
      token: validatedToken,
      newPassword: newPassword
    };

    axios
      .put('https://api.ohmystack.co/api/reset-password', data)
      .then((response) => {
        console.log('비밀번호가 성공적으로 변경되었습니다: ', response.data);
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/signin');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCodeChange = (e) => {
    setToken(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleTokenVerification = () => {
    if (token) {
      validateToken();
    } else {
      alert('인증 코드를 입력해주세요.');
    }
  };

  const handlePasswordReset = () => {
    if (validatedToken && newPassword) {
      resetPassword();
    } else {
      alert('인증이 완료되지 않았거나 새로운 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div>
      <Header />
      <div className="search_password">
        <div className="search_password-box">
          <p
            style={{
              fontSize: '28px',
              marginTop: '20px',
              marginBottom: '35px',
              marginRight: '100px',
              display: 'flex',
              justifyContent: 'flex-start',
              fontWeight: 'bold',
              textAlign: 'left'
            }}
          >
            비밀번호 찾기
          </p>
          <Form.Group className="num_p" controlId="num">
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
              <FloatingLabel controlId="numpass" label="PhoneNumber" className="numpass">
                <Form.Control
                  type="number"
                  className="pass_number"
                  placeholder="010-1234-5678"
                  style={{
                    background: 'rgba(255, 255, 255, 0.89)',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    width: '195px',
                    height: '50px',
                    marginBottom: '5px',
                    borderRadius: '40px'
                  }}
                  value={userNumber}
                  onChange={(e) => setUserNumber(e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel controlId="spass" label="Email" className="emailpass">
                <Form.Control
                  className="pass_email"
                  type="email"
                  placeholder="name@example.com"
                  style={{
                    background: 'rgba(255, 255, 255, 0.89)',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    width: '195px',
                    height: '50px',
                    marginBottom: '20px',
                    borderRadius: '40px'
                  }}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </FloatingLabel>
            </div>
            {
              sendingEmail ? (
                <div className="loading-con">
                  <Spinner animation="border" role="status" className="spin">
                  </Spinner>
                  <span className="loading-text">로딩중...</span>
                </div>
              ) : (
                <Button variant="primary" onClick={sendEmail} className="sendemail-button">
                  인증
                </Button>
              )
            }
          </Form.Group>


          <Form.Group>
            <FloatingLabel controlId="token" label="인증 코드" className="passtoken">
              <Form.Control
                type="text"
                className="pass_token"
                placeholder="인증 코드를 입력하세요"
                style={{
                  background: 'rgba(255, 255, 255, 0.89)',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  width: '280px',
                  height: '50px',
                  marginBottom: '5px',
                  borderRadius: '40px'
                }}
                value={token}
                onChange={handleCodeChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Button className="passtokencon" onClick={handleTokenVerification}>
            인증확인
          </Button>

          <Form.Group>
            <FloatingLabel controlId="newPassword" label="새 비밀번호" className="passnew">
              <Form.Control
                type="password"
                className="passnewword"
                placeholder="새로운 비밀번호를 입력하세요"
                style={{
                  background: 'rgba(255, 255, 255, 0.89)',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  width: '280px',
                  height: '50px',
                  marginBottom: '5px',
                  borderRadius: '40px'
                }}
                value={newPassword}
                onChange={handlePasswordChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Button className="psword_gotochange" onClick={handlePasswordReset}>
            비밀번호 변경
          </Button>
        </div>
      </div>
    </div >
  );
}

export default SearchPassword;
