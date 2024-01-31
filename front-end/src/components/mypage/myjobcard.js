import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, ListGroup } from 'react-bootstrap';
import RecruitStackImg from '../ai_notice/recruit_stack_img';
import axios from 'axios';
import '../../components/style/jobcard.css';

function MyJobCard({ id, title, position, inner_company, address, stack, site, career, main_business, preferences, qualification, index, apiIdList }) {
  const [isLiked, setIsLiked] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isRecruitTitleHovered, setIsRecruitTitleHovered] = useState(false);

  function formatStack(stack) {
    const stackItems = stack.split(',');
    const formattedStackItems = stackItems.map(item => item.toLowerCase());

    return formattedStackItems;
  }

  useEffect(() => {
    const apiUrl = 'https://api.ohmystack.co/api/user/recruit';
    const token = localStorage.getItem('Authorization');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        id: id
      }
    };
  
    axios.get(apiUrl, config)
      .then((response) => {
        const liked = response.data.some((item) => item.id === id);
        setIsLiked(liked);
      })
      .catch((error) => {
        console.error('Error while checking if job is liked:', error);
      });
  }, [id]);
  
  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(site)
      .then(() => {
        alert('URL이 클립보드에 복사되었습니다!');
      })
      .catch((error) => {
        console.error('URL 복사 실패:', error);
      });
  };

  const handleTitleClick = () => {
    setLgShow(true);
  };

  const handleSiteClick = () => {
    window.open(site, '_blank');
  };

  const handleCloseModal = () => {
    setLgShow(false);
  };

  const handleTitleHover = () => {
    setIsTitleHovered(!isTitleHovered);
  };

  const handleRecruitTitleHover = () => {
    setIsRecruitTitleHovered(!isRecruitTitleHovered);
  };

  const handleLikeButtonClick = () => {
    setIsLiked(!isLiked);

    const apiUrl = 'https://api.ohmystack.co/api/user/recruit';
    const token = localStorage.getItem('Authorization');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    const data = [JSON.stringify(id)];

    if (isLiked) {
      axios
        .delete(apiUrl, { data: data, headers: config.headers })
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error('Error while making delete request: ', error);
        });
    } else {
      axios
        .post(apiUrl, data, config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error('Error while making post request: ', error);
        });
    }
  };

  const getCardClassName = () => {
    if (index !== undefined) {
      if (index <= 10) {
        return 'job-card dia';
      } else if (index <= 30) {
        return 'job-card gold';
      } else if (index <= 50) {
        return 'job-card silver';
      } else if (index <= 100) {
        return 'job-card bronze';
      } else {
        return 'job-card black';
      }
    }

    return 'job-card custom-card';
  };

  return (
    <Card className={getCardClassName()}>
      <Card.Header
        as="h2"
        onMouseLeave={handleRecruitTitleHover}
        onMouseEnter={handleRecruitTitleHover}
        onClick={handleTitleClick}
        style={{ color: isRecruitTitleHovered ? 'lightgray' : 'inherit' }}
      >
        {title}
      </Card.Header>
      <Card.Body>
        <div className="position-company">
          <span className="inner-company">{inner_company}</span>
          <br />
          <span className="position">{position}</span>
          <br />
          {address}
          <br />
          <RecruitStackImg stack={formatStack(stack)} />
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="apply-button">
          <span
            className={`apply-text ${isTitleHovered ? 'hovered' : ''}`}
            onClick={handleSiteClick}
            onMouseEnter={handleTitleHover}
            onMouseLeave={handleTitleHover}
            style={{
              textDecoration: isTitleHovered ? 'underline' : 'none',
              color: isTitleHovered ? '#bb44e4' : 'inherit'
            }}
          >
            지원하기
          </span>
        </div>
        <div className="action-buttons">
          <img
            className={`heart-icon ${isLiked ? 'liked' : ''}`}
            src={isLiked ? '../filled-like.svg' : '../empty-like.svg'}
            alt="하트 아이콘"
            onClick={handleLikeButtonClick}
          />
          <img
            className="share-icon"
            src="../share.svg"
            alt="공유 아이콘"
            onClick={handleCopyUrl}
          />
        </div>
      </Card.Footer>

      <Modal
        size="lg"
        show={lgShow}
        onHide={handleCloseModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup className="my-1" style={{ borderRadius: 0 }}>
            <strong>회사:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {inner_company}
            </ListGroup.Item>
            <strong>직책:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {position}
            </ListGroup.Item>
            <strong>사이트:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              <a
                href={site}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
              >
                {site}
              </a>
            </ListGroup.Item>
            <strong>경력:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {career}
            </ListGroup.Item>
            <strong>주소:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {address}
            </ListGroup.Item>
            <strong>주요 업무:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {main_business?.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </ListGroup.Item>
            <strong>기술 스택:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {formatStack(stack).join(', ')}
            </ListGroup.Item>
            <strong>선호 사항:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {preferences?.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                </React.Fragment>
              ))}
            </ListGroup.Item>
            <strong>자격 요건:</strong>
            <ListGroup.Item
              className="my-2"
              style={{ backgroundColor: 'rgba(187, 68, 228, 0.16)' }}
            >
              {qualification?.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          {/* 모달의 푸터 내용 */}
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default MyJobCard;
