import React from 'react';
import '../../components/style/mystackbox.css';

const MyStackBox = ({ stack, handleStackSelection }) => {


  return (
      <div className="mystack-box">
          <img className="mystack-img" src={stack.img_url} alt={stack.title} />
          <span className="mystack-title">{stack.title}</span>
      </div>
  );
};


export default MyStackBox;