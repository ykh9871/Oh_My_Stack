import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../components/style/mysidebar.css';

function LikeMySidebar() {
  const location = useLocation();

  const [isOpenResume, setIsOpenResume] = useState(false);
  const [isOpenSkills, setIsOpenSkills] = useState(false);
  const [isOpenIntroductions, setIsOpenIntroductions] = useState(false);

  const handleResumeClick = () => {
    setIsOpenResume(!isOpenResume);
    setIsOpenSkills(false);
    setIsOpenIntroductions(false);
  };

  const handleSkillsClick = () => {
    setIsOpenSkills(!isOpenSkills);
    setIsOpenResume(false);
    setIsOpenIntroductions(false);
  };

  const handleIntroductionsClick = () => {
    setIsOpenIntroductions(!isOpenIntroductions);
    setIsOpenResume(false);
    setIsOpenSkills(false);
  };

  const isMenuActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    setIsOpenResume(isMenuActive('/mypage/mystack') || isMenuActive('/mypage/editmystacks') || isMenuActive('/mypage/myintroductions') || 
    isMenuActive('/mypage/writeintroduction'));
    setIsOpenSkills(isMenuActive('/mypage/myliked') || isMenuActive('/mypage/editskills'));
    setIsOpenIntroductions(isMenuActive('/mypage/myprofile') || isMenuActive('/mypage/editprofile') || isMenuActive('/mypage/changepassword'));
  }, [location.pathname]);

  return (
    <div className="likemysidebar">
      <div style={{ marginTop: '10px', marginBottom: '40px', fontSize: '150%' }}>마이페이지</div>

      <div
        className={`menu ${isOpenResume ? 'active' : ''}`}
        onClick={handleResumeClick}
      >
        {isOpenResume ? '▼ 나의 이력서' : '▶ 나의 이력서'}
      </div>
      {isOpenResume && (
        <div className="submenu">
          <div className={`submenu-item ${isMenuActive('/mypage/mystack') ? 'active' : ''}`}>
            <Link to="/mypage/mystack">- {isMenuActive('/mypage/mystack') ? <span className="highlight">나의 기술 스택</span> : '나의 기술 스택'}</Link>
          </div>
          <div className={`submenu-item ${isMenuActive('/mypage/editmystacks') ? 'active' : ''}`}>
            <Link to="/mypage/editmystacks">- {isMenuActive('/mypage/editmystacks') ? <span className="highlight">스택 수정하기</span> : '스택 수정하기'}</Link>
          </div>
          <div className={`submenu-item ${isMenuActive('/mypage/myintroductions') ? 'active' : ''}`}>
            <Link to="/mypage/myintroductions">- {isMenuActive('/mypage/myintroductions') ? <span className="highlight">자기소개서 목록</span> : '자기소개서 목록'}</Link>
          </div>
          <div className={`submenu-item ${isMenuActive('/mypage/writeintroduction') ? 'active' : ''}`}>
            <Link to="/mypage/writeintroduction">- {isMenuActive('/mypage/writeintroduction') ? <span className="highlight">자기소개서 작성하기</span> : '자기소개서 작성하기'}</Link>
          </div>
        </div>
      )}

      <div
        className={`menu ${isOpenSkills ? 'active' : ''}`}
        onClick={handleSkillsClick}
      >
        {isOpenSkills ? '▼ 관심 공고' : '▶ 관심 공고'}
      </div>
      {isOpenSkills && (
        <div className="submenu">
          <div className={`submenu-item ${isMenuActive('/mypage/myliked') ? 'active' : ''}`}>
            <Link to="/mypage/myliked">- {isMenuActive('/mypage/myliked') ? <span className="highlight">좋아요한 공고</span> : '좋아요한 공고'}</Link>
          </div>
        </div>
      )}

      <div
        className={`menu ${isOpenIntroductions ? 'active' : ''}`}
        onClick={handleIntroductionsClick}
      >
        {isOpenIntroductions ? '▼ 회원 정보' : '▶ 회원 정보'}
      </div>
      {isOpenIntroductions && (
        <div className="submenu">
          <div className={`submenu-item ${isMenuActive('/mypage/myprofile') ? 'active' : ''}`}>
            <Link to="/mypage/myprofile">- {isMenuActive('/mypage/myprofile') ? <span className="highlight">나의 회원 정보</span> : '나의 회원 정보'}</Link>
          </div>
          <div className={`submenu-item ${isMenuActive('/mypage/editprofile') ? 'active' : ''}`}>
            <Link to="/mypage/editprofile">- {isMenuActive('/mypage/editprofile') ? <span className="highlight">회원 정보 수정</span> : '회원 정보 수정'}</Link>
          </div>
          <div className={`submenu-item ${isMenuActive('/mypage/changepassword') ? 'active' : ''}`}>
            <Link to="/mypage/changepassword">- {isMenuActive('/mypage/changepassword') ? <span className="highlight">비밀번호 변경</span> : '비밀번호 변경'}</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LikeMySidebar;
