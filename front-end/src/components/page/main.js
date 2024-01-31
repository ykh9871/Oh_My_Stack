import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../../components/style/main.css';
import Header from '../../components/base/header';
import Footer from '../../components/base/footer';

const Main = () => {
    return (
        <>
            <Header />
            <div className="default-container">
                <div className="image-container">
                    <div className="text-container">
                        <h3 className="text1">
                            <strong>IT tech stack</strong> 기반 추천 서비스입니다
                        </h3>
                        <h3 className="text2">
                            나의 <strong>tech stack</strong>에 맞는 채용공고를 추천 받아보세요<strong>!</strong>
                        </h3>
                        <p className="text3">
                            <span className="signup-link"><Link to="/signup" style={{ color: '#bb44e4' }}>회원가입</Link></span>을 하면 추가 입력 없이 바로 추천 결과를 보여드립니다.
                        </p>
                        <div className="button-container">
                            <Button variant="light" as={Link} to="/stack" className="custom-button">AI Start</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Main;