import React, { useState } from 'react';
import '../../components/style/stackbox.css';

const StackBox = ({ stack, handleStackSelection, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBoxClick = () => {
    if (handleStackSelection) {
      handleStackSelection(stack);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const boxClassName = isSelected ? 'stack-box selected' : 'stack-box';
  const titleClassName = isSelected ? 'stack-title selected' : 'stack-title';
  const hoverClassName = isHovered && isSelected ? 'hovered-selected' : '';

  return (
    <div
      className={`${boxClassName} ${hoverClassName}`}
      onClick={handleBoxClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img className="stack-img" src={stack.img_url} alt={stack.title} />
      <span className={titleClassName}>{stack.title}</span>
    </div>
  );
};

export default StackBox;
