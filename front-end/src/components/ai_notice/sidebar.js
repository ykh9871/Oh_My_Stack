import React, { useState, useEffect } from 'react';
import '../../components/style/sidebar.css';

function Sidebar({ allPositions, handleFilterChange, selectedPositions }) {
  const [selectedPositionsInternal, setSelectedPositionsInternal] = useState([]);

  useEffect(() => {
    setSelectedPositionsInternal(selectedPositions);
  }, [selectedPositions]);

  const handleCheckboxChange = (position) => {
    let updatedPositions = [...selectedPositionsInternal];

    if (updatedPositions.includes(position)) {
      updatedPositions = updatedPositions.filter(
        (selectedPosition) => selectedPosition !== position
      );
    } else {
      updatedPositions.push(position);
    }

    setSelectedPositionsInternal(updatedPositions);
    handleFilterChange(updatedPositions);
  };

  return (
    <div className="sidebar">
      {allPositions.map((position) => (
        <div key={position} className="position-checkbox">
          <input
            id={position}
            type="checkbox"
            checked={selectedPositionsInternal.includes(position)}
            onChange={() => handleCheckboxChange(position)}
          />
          <label htmlFor={position}>{position}</label>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
