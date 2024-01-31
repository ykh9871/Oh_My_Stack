import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import Sidebar from '../ai_notice/sidebar';
import JobCard from '../ai_notice/jobcard';
import Legend from '../ai_start/legend';
import '../../components/style/recruit.css';

const gridTemplateColumns = 'repeat(2, 1fr)';

function Recommend() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [inputPage, setInputPage] = useState('1');
  const [searchResultMessage, setSearchResultMessage] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const positions = urlParams.get("positions");
    return positions ? positions.split(",") : [];
  });
  const [selectedCareer, setSelectedCareer] = useState("");
  const searchInputRef = useRef(null);
  const pageInputRef = useRef(null);
  const itemsPerPage = 4;
  const recommendedRecruitsRef = useRef([]);

  useEffect(() => {
    const recommendedRecruits = JSON.parse(localStorage.getItem('recommendedRecruits'));
    if (recommendedRecruits) {
      recommendedRecruitsRef.current = recommendedRecruits;
    }

    const newFilteredRecruits = recommendedRecruitsRef.current.filter((recruit) => {
      const recruitTitle = recruit.title.toLowerCase();
      const recruitPosition = recruit.position.toLowerCase();
      const recruitAddress = recruit.address ? recruit.address.toLowerCase() : '';
      const recruitInnerCompany = recruit.inner_company ? recruit.inner_company.toLowerCase() : '';
      return (
        (recruitTitle.includes(searchQuery.toLowerCase()) ||
          recruitAddress.includes(searchQuery.toLowerCase()) ||
          recruitInnerCompany.includes(searchQuery.toLowerCase())) &&
        (selectedPositions.length === 0 || selectedPositions.includes(recruit.position)) &&
        (selectedCareer === "" || recruit.career === selectedCareer)
      );
    });

    setFilteredRecruits(newFilteredRecruits);
    setCurrentPage(1);

    if (newFilteredRecruits.length === 0) {
      setSearchResultMessage(true);
    } else {
      setSearchResultMessage(false);
    }
  }, [searchQuery, selectedPositions, selectedCareer]);

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
    const newFilteredRecruits = recommendedRecruitsRef.current.filter((recruit) => {
      const recruitTitle = recruit.title.toLowerCase();
      const recruitPosition = recruit.position.toLowerCase();
      const recruitAddress = recruit.address ? recruit.address.toLowerCase() : '';
      const recruitInnerCompany = recruit.inner_company ? recruit.inner_company.toLowerCase() : '';
      return (
        (recruitTitle.includes(searchQuery.toLowerCase()) ||
          recruitAddress === searchQuery.toLowerCase() ||
          recruitInnerCompany.includes(searchQuery.toLowerCase())) &&
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
    setFilteredRecruits(recommendedRecruitsRef.current);
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

  const startIndex = Math.max((currentPage - 1) * itemsPerPage, 0) + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, filteredRecruits.length);
  const visibleRecruits = filteredRecruits.slice(startIndex - 1, endIndex);
  const renderJobCards = () => {
    return visibleRecruits.map((recruit, index) => (
      <JobCard
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
        index={recruit.index}
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
          <h1 style={{ marginTop: '20px', marginLeft: '20px' }}>AI 추천 결과</h1>
          <select value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}>
            <option value="">경력 선택</option>
            {Array.from(new Set(recommendedRecruitsRef.current.map((recruit) => recruit.career)))
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
          </div>
          <Sidebar
            allPositions={Array.from(new Set(recommendedRecruitsRef.current.map((recruit) => recruit.position)))}
            selectedPositions={selectedPositions}
            handleFilterChange={handleFilterChange}
          />
        </div>
        <div className="content-container">
          <Legend />
          <div className={`search-result-message ${searchResultMessage ? 'show' : ''}`}>
            검색된 공고가 없습니다.
          </div>
          <div className="legend-grid-container" style={{ gridTemplateColumns }}>
            {renderJobCards()}
          </div>
          {renderPagination()}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Recommend;
