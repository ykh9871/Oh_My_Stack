import React from 'react';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import StackContainer from '../ai_start/stackcontainer';
import '../../components/style/mystack.css';

function EditMyStacks() {
  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="content">
          <h1>스택 수정하기</h1>
          <StackContainer />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditMyStacks;
