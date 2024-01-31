import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Header from '../base/header';
import '../../components/style/stack.css';
import Footer from '../base/footer';
import StackList from '../base/stacklist';
import StackBox from '../base/stackbox';

function Stack() {
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredStacks, setFilteredStacks] = useState([]);
  const [allStacks, setAllStacks] = useState([]);
  const [isError, setIsError] = useState(false);

  const handleStackSelection = (stack) => {
    const isAlreadySelected = selectedStacks.some(
      (selectedStack) =>
        selectedStack.title === stack.title && selectedStack.url === stack.url
    );

    if (isAlreadySelected) {
      setSelectedStacks(
        selectedStacks.filter(
          (selectedStack) =>
            selectedStack.title !== stack.title ||
            selectedStack.url !== stack.url
        )
      );
    } else {
      setSelectedStacks([...selectedStacks, stack]);
      setTimeout(() => {
        const selectedStackBox = document.querySelector('.selected-stack-box');
        selectedStackBox.scrollLeft = selectedStackBox.scrollWidth;
      }, 0);
    }
  };

  useEffect(() => {
    const totalStackApiUrl = 'https://api.ohmystack.co/api/total_stack';

    axios
      .get(totalStackApiUrl)
      .then((response) => {
        setAllStacks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching total stack data:', error);
      });

    const storedSelectedStacks = localStorage.getItem('selectedStacks');
    if (storedSelectedStacks) {
      setSelectedStacks(JSON.parse(storedSelectedStacks));
    }
  }, []);

  useEffect(() => {
    const newFilteredStacks = allStacks.filter((stack) =>
      stack.title.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredStacks(newFilteredStacks);
  }, [inputValue, allStacks]);

  useEffect(() => {
    localStorage.setItem('selectedStacks', JSON.stringify(selectedStacks));
    setIsError(selectedStacks.length < 3);
  }, [selectedStacks]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNextButtonClick = () => {
    if (selectedStacks.length < 3) {
      alert('3개 이상의 스택을 선택해야 합니다.');
    } else {
      // Continue with the next action
      // 페이지 이동을 처리하는 로직을 여기에 추가할 수 있습니다.
    }
  };

  return (
    <>
      <Header />
      <div className='default-container'>
        <div className="stack-container">
          <br />
          <p style={{ marginBottom: '0px' }}>
            <strong style={{ color: 'red' }}>*필수</strong>
          </p>
          <h3 className="stack-heading">보유하신 기술 스택을 입력해주세요.</h3>
          <input
            type="text"
            className="input-box"
            placeholder="입력해주세요"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="selected-stack-box">
            {selectedStacks.map((stack, index) => (
              <StackBox
                key={index}
                stack={stack}
                handleStackSelection={handleStackSelection}
                isSelected={true}
              />
            ))}
          </div>
          <br />
          <div className="custom-box">
            <StackList
              stacks={filteredStacks}
              handleStackSelection={handleStackSelection}
              selectedStackIds={selectedStacks.map((stack) => stack.id)}
            />
          </div>
          <div className="button-container">
            {selectedStacks.length < 3 ? (
              <Button
                variant="light"
                className="next-button"
                disabled={true}
              >
                다음
              </Button>
            ) : (
              <Link to="/introduce">
                <Button
                  variant="light"
                  className="next-button"
                  onClick={handleNextButtonClick}
                >
                  다음
                </Button>
              </Link>
            )}
          </div><br></br>
          {selectedStacks.length < 3 && (
            <p style={{ color: 'red' }}>3개 이상의 스택을 선택해야 합니다.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Stack;
