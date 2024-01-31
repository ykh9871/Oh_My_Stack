import React, { useEffect, useState } from 'react';
import axios from 'axios';
import recruitData from '../../json_data/recruit.json';

function Ai() {
  const [selfIntr, setSelfIntr] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleInputChange = (e) => {
    setSelfIntr(e.target.value);
  };

  const handleRecommendationClick = async () => {
    try {
      const requestData = {
        self_intr: selfIntr
      };

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post('https://fastapi.ohmystack.co/job_recommendation', requestData, config);
      const responseData = JSON.parse(response.data);
      const jobRecommendations = responseData.job_recommendations;

      // 채용공고 데이터와 추천 작업 결과 매핑
      const mappedData = jobRecommendations.map((recommendation, index) => ({
        index: index + 1,
        ...recruitData.find((recruit) => recruit.id === recommendation)
      }));

      setRecommendations(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Job Recommendations</h2>
      <div>
        <label>
          Self Introduction:
          <input type="text" value={selfIntr} onChange={handleInputChange} />
        </label>
      </div>
      <button onClick={handleRecommendationClick}>AI 추천</button>
      <ul>
        {recommendations.map((recommendation) => (
          <li key={recommendation.id}>
            <p>Index: {recommendation.index}</p>
            <p>Title: {recommendation.title}</p>
            <p>Description: {recommendation.description}</p>
            {/* 추가 필요한 채용공고 데이터 표시 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ai;
