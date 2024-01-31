import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FloatingLabel, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Header from '../../components/base/header';
import '../../components/style/signup.css';

function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userEmailError, setUserEmailError] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRePassword, setUserRePassword] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
    return re.test(password);
  };

  const validateMobile = (number) => {
    const re = /^01([0-9]{1})([0-9]{3,4})([0-9]{4})$/;
    return re.test(number);
  };

  const handleUserNameChange = (name) => {
    setUserName(name);

    if (name.trim() === '') {
      setUserNameError('이름을 입력해주세요.');
    } else {
      setUserNameError('');
    }
  };

  const handleEmailChange = (email) => {
    setUserEmail(email);

    if (email.trim() === '') {
      setUserEmailError('이메일을 입력해주세요.');
    } else if (!validateEmail(email)) {
      setUserEmailError('유효한 이메일을 입력해주세요.');
    } else {
      setUserEmailError('');
    }
  };

  const handlePasswordChange = (password) => {
    setUserPassword(password);

    if (!validatePassword(password)) {
      setPasswordError('최소 8자, 소문자, 숫자, 특수문자(@$!%*?&#)');
    } else {
      setPasswordError('');
    }
  };

  const handleNumberChange = (number) => {
    setUserNumber(number);

    if (!validateMobile(number)) {
      setNumberError('유효하지 않은 휴대폰 번호입니다.');
    } else {
      setNumberError('');
    }
  };

  const sendVerificationCode = async () => {
    if (userEmail.trim() === '') {
      setUserEmailError('이메일을 입력해주세요.');
      return;
    } else if (!validateEmail(userEmail)) {
      setUserEmailError('유효한 이메일을 입력해주세요.');
      return;
    }

    try {
      setVerificationLoading(true);
      setVerificationSent(false);
      setSignupError('');
      setShowVerificationCode(false);

      const response = await axios.post('https://api.ohmystack.co/api/verify-email', {
        email: userEmail
      });

      console.log(response.data);
      setVerificationLoading(false);
      setVerificationSent(true);
      setShowVerificationCode(true);
    } catch (error) {
      console.log(error);
      setVerificationLoading(false);
      setSignupError('이메일 인증 요청에 실패했습니다.');
    }
  };

  const verifyEmailCode = () => {
    axios
      .post('https://api.ohmystack.co/api/verify-email-code', {
        email: userEmail,
        code: verificationCode
      })
      .then((response) => {
        console.log(response.data);
        alert('인증이 완료되었습니다.');
      })
      .catch((error) => {
        console.log(error);
        setSignupError('인증에 실패했습니다.');
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (userPassword !== userRePassword) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(userPassword)) {
      setSignupError('유효한 비밀번호가 아닙니다.');
      return;
    }

    if (!validateEmail(userEmail)) {
      setSignupError('유효한 이메일이 아닙니다.');
      return;
    }

    if (!validateMobile(userNumber)) {
      setSignupError('유효한 번호가 아닙니다.');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await axios.post('https://api.ohmystack.co/api/signup', {
        phoneNumber: userNumber,
        email: userEmail,
        password: userPassword,
        nickName: userName
      });

      console.log(response.data);
      setSubmitLoading(false);
      alert('Happy Coding Day!');
      navigate('/');
    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
      setSignupError('회원가입에 실패했습니다.');
    }
  };

  return (
    <div>
      <Header />
      <div className="sign_up">
        <div className="form-box">
          <p
            style={{
              fontSize: '30px',
              marginTop: '-10px',
              marginRight: '155px',
              display: 'flex',
              justifyContent: 'flex-start',
              fontWeight: 'bold',
              textAlign: 'left'
            }}
          >
            회원가입
          </p>
          <Form onSubmit={submitHandler}>
            <Form.Group className="n_up" controlId="UserName">
              <FloatingLabel label="UserName" className="name_up">
                <Form.Control
                  type="text"
                  className="nn"
                  placeholder="ex)고양이귀여워"
                  style={{
                    background: 'rgba(255, 255, 255, 0.89)',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    width: '280px',
                    height: '50px',
                    marginBottom: '20px',
                    borderRadius: '40px'
                  }}
                  onChange={(e) => handleUserNameChange(e.target.value)}
                />
                {userNameError && <Form.Text className="text-danger">{userNameError}</Form.Text>}
              </FloatingLabel>
            </Form.Group>
            {userEmailError && <p className="text-danger">{userEmailError}</p>}
            <Form.Group className="i_up" controlId="Id">
              <div className="ver-container">
                <FloatingLabel label="Email" className="id_up">
                  <Form.Control
                    type="email"
                    className="ii"
                    placeholder="ex) ohmystack@gmail.com"
                    style={{
                      background: 'rgba(255, 255, 255, 0.89)',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      width: '195px',
                      height: '50px',
                      marginBottom: '20px',
                      borderRadius: '40px'
                    }}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                </FloatingLabel>
                {verificationLoading ? (
                  <div className="verification-spinner-container">
                    <Spinner animation="border" role="status" className="verification-spinner" />
                    <span className="veriloading">로딩중...</span>
                  </div>
                ) : (
                  <Button variant="primary" onClick={sendVerificationCode} className="emailbtn_up">
                    인증
                  </Button>
                )}
              </div>
            </Form.Group>
            {showVerificationCode && (
              <Form.Group className="v_up" controlId="VerificationCode">
                <div className="code-verification-container">
                  <FloatingLabel label="Email Code" className="verification_up">
                    <Form.Control
                      type="text"
                      className="vv"
                      placeholder="인증번호 입력"
                      style={{
                        background: 'rgba(255, 255, 255, 0.89)',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        width: '195px',
                        height: '50px',
                        marginBottom: '20px',
                        borderRadius: '40px'
                      }}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </FloatingLabel>
                  <Button variant="primary" onClick={verifyEmailCode} className="vbtn_up">
                    확인
                  </Button>
                </div>
              </Form.Group>
            )}
            <Form.Group className="p_up" controlId="Password">
              <FloatingLabel label="Password" className="password_up">
                <Form.Control
                  type="password"
                  className="pp"
                  placeholder="Password"
                  style={{
                    background: 'rgba(255, 255, 255, 0.89)',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    width: '280px',
                    height: '50px',
                    marginBottom: '20px',
                    borderRadius: '40px'
                  }}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="rep_up" controlId="RePassword">
              <FloatingLabel label="Re-Password" className="repassword_up">
                <Form.Control
                  type="password"
                  className="repp"
                  placeholder="RePassword"
                  style={{
                    background: 'rgba(255, 255, 255, 0.89)',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    width: '280px',
                    height: '50px',
                    marginBottom: '20px',
                    borderRadius: '40px'
                  }}
                  onChange={(e) => setUserRePassword(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="n_up" controlId="PhoneNumber">
              <FloatingLabel label="PhoneNumber" className="number_up">
                <Form.Control
                  type="number"
                  className="updown"
                  placeholder="010-1234-5678"
                  style={{
                    background: 'rgba(255, 255, 255, 0.89)',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '40px',
                    width: '280px',
                    height: '50px',
                    marginBottom: '20px'
                  }}
                  onChange={(e) => handleNumberChange(e.target.value)}
                />
                {numberError && <Form.Text className="text-danger">{numberError}</Form.Text>}
              </FloatingLabel>
            </Form.Group>
            {signupError && <Alert variant="danger">{signupError}</Alert>}
            {submitLoading ? (
              <div className="signcon">
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="lospin" />
                <span className="spanloading">로딩중...</span>
              </div>
            ) : (
              <Button variant="primary" type="submit" className="b_up" disabled={submitLoading}>
                계정생성
              </Button>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
