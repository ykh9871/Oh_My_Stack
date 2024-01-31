import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/base/header';
import Footer from '../base/footer';
import '../../components/style/introduce.css';
import Spinner from './spinner.svg';

function Introduce() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const maxCharacters = 1500;
  const navigate = useNavigate();

  useEffect(() => {
    const introduction = localStorage.getItem('introduction');
    if (introduction) {
      setValue(introduction);
    }
  }, []);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= maxCharacters) {
      setValue(inputValue);
      localStorage.setItem('introduction', inputValue);
    }
  };

  const handleSaveButtonClick = () => {
    setLoading(true);

    setTimeout(() => {
      const selectedStacks = localStorage.getItem('selectedStacks');
      if (!selectedStacks || selectedStacks === '[]') {
        alert('스택이 입력되지 않았습니다. \n기술 스택 입력 화면으로 이동합니다.');
        navigate('/stack');
        setLoading(false);
        return;
      }

      const stacksArray = JSON.parse(selectedStacks);
      const modifiedStacks = stacksArray.map((stack) => stack.title).join(' '); // 스택의 제목만 가져옵니다.

      const introduction = (modifiedStacks ? modifiedStacks + ' ' : '') + value; // 수정된 스택과 자기소개를 결합합니다.
      localStorage.setItem('self_intr', introduction);
      setLoading(false);

      // API 호출
      let data = JSON.stringify({ self_intr: introduction });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://fastapi.ohmystack.co/job_recommendation',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          const recommendedIds = JSON.parse(response.data).job_recommendations;
          localStorage.setItem('recommended_id', JSON.stringify(recommendedIds));
          localStorage.removeItem('self_intr');
          navigate('/result');
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className={`default-container ${isLoading ? 'blur' : ''}`}>
        {isLoading && (
          <div className="loading-container">
            <div className="loading-overlay"></div>
            <div className="loading-content">
              <img src={Spinner} alt="로딩중" />
              <span style={{ fontSize: '25px' }}>로딩 중입니다.</span>
            </div>
          </div>
        )}
        <div className="introduce-container">
          <div className="introduce-content" style={{ height: '560px' }}>
            <div className="ex">
              <p style={{ marginBottom: '0px' }}>
                <strong style={{ color: 'blue' }}>*선택(권장)</strong>
              </p>
              <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>자기소개서를 입력해 주세요</h3>
              <p style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                개조식으로 직무 관련 경험 위주로 작성해주세요.
              </p>
              <p style={{ textAlign: 'center', fontSize: '15px' }}>ex) AWS EC2를 활용한 백엔드 배포, Figma를 사용한 UI/UX 설계 등</p>
              <FloatingLabel
                controlId="floatingTextarea2"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Form.Control
                  as="textarea"
                  placeholder="자기소개서를 입력해주세요"
                  style={{
                    resize: 'none',
                    backgroundColor: 'rgba(187, 68, 228, 0.16)',
                    width: '566.07px',
                    height: '275.87px',
                    color: 'black',
                  }}
                  maxLength={maxCharacters}
                  value={value}
                  onChange={handleChange}
                />
              </FloatingLabel>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ display: 'inline-block', marginRight: '300px', textAlign: 'left' }}>
                  {/* 최소 500자 이상 입력해주세요. */}
                </p>
                <p style={{ display: 'inline-block', textAlign: 'right', marginLeft: '140px' }}>
                  {value.length}/{maxCharacters}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', textsize: 'auto' }}>
                <Button className="previous-button" variant="light" as={Link} to="/stack">
                  이전
                </Button>
                <Button className="result-button" variant="light" disabled={isLoading} onClick={handleSaveButtonClick}>
                  {isLoading ? '로딩 중...' : '결과 보러 가기'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Introduce;
