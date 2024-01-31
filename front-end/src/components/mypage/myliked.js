import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import MyJobCard from './myjobcard';
import '../../components/style/recruit.css';
import allRecruits from '../../json_data/recruit.json';
import LikeMySidebar from './likemysidebar';
import axios from 'axios';

const gridTemplateColumns = 'repeat(2, 1fr)';

function MyLiked() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [inputPage, setInputPage] = useState('1');
  const [searchResultMessage, setSearchResultMessage] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const searchInputRef = useRef(null);
  const pageInputRef = useRef(null);

  const itemsPerPage = 4;
  const allRecruitsRef = useRef(allRecruits);

  useEffect(() => {
    const apiUrl = 'https://api.ohmystack.co/api/user/recruit';
    const token = localStorage.getItem('Authorization');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get(apiUrl, config)
      .then((response) => {
        const likedRecruitIds = response.data.map((item) => item.id);
        const newFilteredRecruits = allRecruitsRef.current.filter((recruit) => {
          return (
            likedRecruitIds.includes(recruit.id) &&
            (recruit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (recruit.address && recruit.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (recruit.inner_company && recruit.inner_company.toLowerCase().includes(searchQuery.toLowerCase()))) &&
            (selectedPositions.length === 0 || selectedPositions.includes(recruit.position))
          );
        });
        setFilteredRecruits(newFilteredRecruits);
        setCurrentPage(1);
        if (newFilteredRecruits.length === 0) {
          setSearchResultMessage(true);
        } else {
          setSearchResultMessage(false);
        }
      })
      .catch((error) => {
        console.error('Error while fetching liked recruits:', error);
      });
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setInputPage((prevPage) => (prevPage - 1).toString());
    }
  };

  const totalPages = Math.ceil(filteredRecruits.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      setInputPage((prevPage) => (parseInt(prevPage) + 1).toString());
    }
  };

  const handleSearch = () => {
    setSearchResultMessage(false);
    const newFilteredRecruits = allRecruitsRef.current.filter((recruit) => {
      return (
        recruit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recruit.address && recruit.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recruit.inner_company && recruit.inner_company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    setFilteredRecruits(newFilteredRecruits);
    setCurrentPage(1);
    if (newFilteredRecruits.length === 0) {
      setSearchResultMessage(true);
    } else {
      setSearchResultMessage(false);
    }
  };

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      let newPage = parseInt(inputPage);
      if (newPage < 1) {
        newPage = 1;
      } else if (newPage > totalPages) {
        newPage = totalPages;
      }
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (searchInputRef.current && searchInputRef.current === document.activeElement) {
      const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      };
      document.addEventListener('keydown', handleSearchKeyPress);
      return () => {
        document.removeEventListener('keydown', handleSearchKeyPress);
      };
    }
  }, [searchQuery]);

  useEffect(() => {
    if (pageInputRef.current && pageInputRef.current === document.activeElement) {
      const handlePageInputKeyPress = (e) => {
        if (e.key === 'Enter') {
          handlePageChange();
        }
      };
      document.addEventListener('keydown', handlePageInputKeyPress);
      return () => {
        document.removeEventListener('keydown', handlePageInputKeyPress);
      };
    }
  }, []);

  useEffect(() => {
    setFilteredRecruits(allRecruitsRef.current);
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputPage(pageNumber.toString());
    }
  };

  const handleFilterChange = (selectedPositions) => {
    setSelectedPositions(selectedPositions);
  };

  const startIndex = Math.max((currentPage - 1) * itemsPerPage, 0);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRecruits.length);
  const visibleRecruits = filteredRecruits.slice(startIndex, endIndex);

  const renderJobCards = () => {
    return visibleRecruits.map((recruit) => (
      <MyJobCard
        key={recruit.id}
        id={recruit.id}
        title={recruit.title}
        position={recruit.position}
        inner_company={recruit.inner_company}
        address={recruit.address}
        stack={recruit.stack}
        site={recruit.site}
        career={recruit.career}
        main_business={recruit.main_business}
        preferences={recruit.preferences}
        qualification={recruit.qualification}
      />
    ));
  };

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const maxPageNumbersToShow = 9;
    const maxPageNumbersPerSide = 4;

    let startPage = currentPage - maxPageNumbersPerSide;
    let endPage = currentPage + maxPageNumbersPerSide;

    if (startPage <= 0) {
      endPage += Math.abs(startPage) + 1;
      startPage = 1;
    }

    if (endPage > totalPages) {
      startPage -= endPage - totalPages;
      endPage = totalPages;
    }

    const visiblePageNumbers = pageNumbers.slice(startPage - 1, startPage - 1 + maxPageNumbersToShow);

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          이전
        </button>
        <span>
          {visiblePageNumbers.map((pageNumber) => (
            <Link
              key={pageNumber}
              to="#"
              className={`pagination-link ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Link>
          ))}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="recruit-container">
        <div className="sidebar-container">
          <h1 style={{ marginTop: '20px', marginLeft: '50px', marginBottom: '25px' }}>채용 공고</h1>
          <select value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}>
            <option value="">경력 선택</option>
            {Array.from(new Set(allRecruits.map((recruit) => recruit.career)))
              .sort((a, b) => {
                if (a === "신입 이상") return -1;
                if (b === "신입 이상") return 1;
                const numRegex = /(\d+)/;
                const numA = a.match(numRegex);
                const numB = b.match(numRegex);
                if (!numA) return 1;
                if (!numB) return -1;
                return parseInt(numA[0]) - parseInt(numB[0]);
              })
              .map(career => (
                <option key={career} value={career}>{career}</option>
              ))}
          </select>
          <div className="search-container">
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {/* <button className="search-button" onClick={handleSearch}>
              검색
            </button> */}
          </div>
          <LikeMySidebar />
        </div>
        <div className="content-container">
          <div className={`search-result-message ${searchResultMessage ? 'show' : ''}`}>
            검색된 공고가 없습니다.
          </div>
          <div className="grid-container" style={{ gridTemplateColumns }}>
            {renderJobCards()}
          </div>
          {renderPagination()}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyLiked;
