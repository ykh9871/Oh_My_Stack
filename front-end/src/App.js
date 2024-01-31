import React from "react";
import './App.css';
import Main from './components/page/main';
import Home from './components/page/home';
import Notice from './components/ai_notice/recruit';
import Signup from './components/login/signup';
import Signin from './components/login/signin';
import SearchId from './components/login/searchid';
import SearchPassword from './components/login/searchpassword';
import Stack from './components/ai_start/stack';
import Introduce from './components/ai_start/introduce';
import Result from './components/ai_start/result';
import Recommend from './components/ai_start/recommend.js';
import Ai from "./components/ai_start/ai";
import Mystack from "./components/mypage/mystack";
import ChangePassword from "./components/mypage/changepassword";
import EditProfile from "./components/mypage/editprofile";
import MyIntroductions from "./components/mypage/myintroductions";
import MyLiked from "./components/mypage/myliked";
import MyProfile from "./components/mypage/myprofile";
import WriteIntroduction from "./components/mypage/writeintroduction";
import EditMyStacks from "./components/mypage/editmystacks";
import IntroductionDetail from "./components/mypage/myintroductions_detail";
import IntroductionEdit from "./components/mypage/introductionedit";
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/introduce" element={<Introduce />} />
          <Route path="/result" element={<Result />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/recruit" element={<Notice />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/searchid" element={<SearchId />} />
          <Route path="/searchpassword" element={<SearchPassword />} />
          <Route path="/mypage/mystack" element={<Mystack />} />
          <Route path="/mypage/changepassword" element={<ChangePassword />} />
          <Route path="/mypage/editprofile" element={<EditProfile />} />
          <Route path="/mypage/myintroductions" element={<MyIntroductions />} />
          <Route path="/mypage/myliked" element={<MyLiked />} />
          <Route path="/mypage/myprofile" element={<MyProfile />} />
          <Route path="/mypage/writeintroduction" element={<WriteIntroduction />} />
          <Route path="/mypage/editmystacks" element={<EditMyStacks  />} />
          <Route path="/mypage/myintroductions/detail/:id" element={<IntroductionDetail />} />
          <Route path="/mypage/myintroductions/edit/:id" element={<IntroductionEdit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
