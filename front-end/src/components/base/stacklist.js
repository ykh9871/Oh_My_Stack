import React from 'react';
import StackBox from './stackbox';

const StackList = ({ stacks, handleStackSelection, selectedStackIds }) => {
  return (
    <div>
      {stacks.map((stack, index) => (
        <StackBox
          key={index}
          stack={stack}
          handleStackSelection={handleStackSelection}
          isSelected={selectedStackIds.includes(stack.id)} // 선택 여부에 따라 isSelected 값 전달
        />
      ))}
    </div>
  );
};

export default StackList;
