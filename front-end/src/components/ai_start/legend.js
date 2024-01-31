// legend.js
import React from 'react';
import '../../components/style/legend.css';

function Legend() {
  return (
    <div className="legend-container">
      <div className="legend-box legend-box-dia">
        <span className="legend-text">Top 10</span>
      </div>      
      <div className="legend-box legend-box-gold">
        <span className="legend-text">Top 30</span>
      </div>      
      <div className="legend-box legend-box-silver">
        <span className="legend-text">Top 50</span>
      </div>     
      <div className="legend-box legend-box-bronze">
        <span className="legend-text">Top 100</span>
      </div>      
      <div className="legend-box legend-box-black">
        <span className="legend-text">그 외</span>
      </div>
    </div>
  );
}

export default Legend;
