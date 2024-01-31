import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import '../../components/style/signin.css';
import Header from '../../components/base/header';
import axios from 'axios';

function Signin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return re.test(password);
  };

  const loginHandler = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("이메일을 입력해주세요");
      return;
    }

    if (!userPassword) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    if (!validateEmail(userId)) {
      alert("유효한 이메일을 입력해주세요");
      return;
    }

    if (!validatePassword(userPassword)) {
      alert("유효한 비밀번호를 입력해주세요");
      return;
    }

    const data = {
      email: userId,
      password: userPassword,
    };

    axios
      .post('https://api.ohmystack.co/api/login', data)
      .then((response) => {
        console.log(response.data);
        const responseData = response.data;
        let inToken = responseData.token; // 서버 응답에서 토큰을 가져옴
        console.log(responseData.token);
        localStorage.setItem("Authorization", inToken);

        alert("로그인 되었습니다!");

        navigate('/', {
          state: responseData,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoginError('입력한 내용을 다시 확인해주세요');
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginHandler(e);
    }
  };

  return (
    <div>
      <Header />
      <div className="log_in">
        <div className="logform-box">
          <p
            style={{
              fontSize: '30px',
              marginTop: '20px',
              marginBottom: '40px',
              marginRight: '155px',
              display: 'flex',
              justifyContent: 'flex-start',
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            로그인
          </p>
          <FloatingLabel controlId="Signin" label="Email" className="sign_in">
            <Form.Control
              className="box1"
              type="email"
              placeholder="name@example.com"
              style={{
                background: 'rgba(255, 255, 255, 0.89)',
                border: '2px solid #FFFFFF',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                width: '280px',
                height: '50px',
                marginBottom: '20px',
                borderRadius: '40px',
              }}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </FloatingLabel>
          <Form.Group controlId="Password" className="password_in">
            <FloatingLabel label="Password" className="ppsin">
              <Form.Control
                className="box2"
                type="password"
                placeholder="Password"
                style={{
                  background: 'rgba(255, 255, 255, 0.89)',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  width: '280px',
                  height: '50px',
                  marginBottom: '30px',
                  borderRadius: '40px',
                }}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </FloatingLabel>
            {loginError && <Form.Text className="text-danger" style={{ textAlign: 'center' }}>{loginError}</Form.Text>}
          </Form.Group>
          <Button type="submit" className="signin-button" onClick={loginHandler}>
            로그인
          </Button>
          <div className="links">
            <Link to="/searchid">
              <p>이메일 찾기</p>
            </Link>
            <Link to="/searchpassword">
              <p>비밀번호 찾기</p>
            </Link>
            <Link to="/signup">
              <p>회원가입</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
