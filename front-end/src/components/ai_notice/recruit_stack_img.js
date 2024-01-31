import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../components/style/recruit_stack_img.css';

function RecruitStackImg({ stack }) {
  const [matchedRecruits, setMatchedRecruits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'https://api.ohmystack.co/api/total_stack';
        const response = await axios.get(apiUrl);
        const allRecruits = response.data;
        const filteredRecruits = allRecruits.filter((recruit) =>
          stack.includes(recruit.title)
        );
        setMatchedRecruits(filteredRecruits);
      } catch (error) {
        console.log('Error fetching stack data:', error);
      }
    };

    fetchData();
  }, [stack]);

  return (
    <div className="recruit-stack-img">
      {matchedRecruits.map((recruit) => (
        <img
          key={recruit.id}
          src={recruit.img_url}
          alt={recruit.title}
          className="stack-image"
          width="30"
          height="30"
          title={recruit.title}
        />
      ))}
    </div>
  );
}

export default RecruitStackImg;
