import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../components/style/nav.css'
import logo from '../../components/img/ohmystack_logo1.jpg';

function NavComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("Authorization");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("Authorization");
        setIsLoggedIn(false);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <header>
            <div className="navbar-fixed">
                <Navbar collapseOnSelect expand="lg" bg="light" variant="dark" className="navbar bg-white">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggler" onClick={toggleMobileMenu} />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Container fluid>
                            {showMobileMenu ? (
                                <Row className="w-100 justify-content-center mt-3">
                                    <Col xs={10}>
                                        <Nav className="flex-column">
                                            {isLoggedIn ? (
                                                <>
                                                    <Nav.Link as={Link} to="/" className="my-link2" onClick={handleLogout}>로그아웃</Nav.Link>
                                                    <Nav.Link as={Link} to="/mypage/mystack" className="my-link2">마이페이지</Nav.Link>
                                                    <Nav.Link as={Link} to="/recruit" className="my-link2">채용공고</Nav.Link>
                                                    <Nav.Link as={Link} to="/stack" className="my-link2">AI 추천</Nav.Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Nav.Link as={Link} to="/signup" className="my-link2">회원가입</Nav.Link>
                                                    <Nav.Link as={Link} to="/signin" className="my-link2">로그인</Nav.Link>
                                                    <Nav.Link as={Link} to="/recruit" className="my-link2">채용공고</Nav.Link>
                                                    <Nav.Link as={Link} to="/stack" className="my-link2">AI 추천</Nav.Link>
                                                </>
                                            )}
                                        </Nav>
                                    </Col>
                                </Row>
                            ) : (
                                <Row className="w-100 align-items-center justify-content-space-between">
                                    <Col xs={5} md={4} className="d-flex justify-content-start">
                                        <Nav className="mr-auto" style={{ marginLeft: '50px' }}>
                                            <Nav.Link as={Link} to="/stack" className="my-link1">AI 추천</Nav.Link>
                                            <Nav.Link as={Link} to="/recruit" className="my-link1">채용공고</Nav.Link>
                                        </Nav>
                                    </Col>
                                    <Col xs={2} md={4} className="d-flex justify-content-center">
                                        <Navbar.Brand as={Link} to="/">
                                            <img src={logo} alt="Oh My Stack!" className="logo" />
                                        </Navbar.Brand>
                                    </Col>
                                    <Col xs={5} md={4} className="d-flex justify-content-end">
                                        <Nav className="ml-auto">
                                            {isLoggedIn ? (
                                                <>
                                                    <Nav.Link as={Link} to="/mypage/mystack" className="my-link2">마이페이지</Nav.Link>
                                                    <Nav.Link as={Link} to="/" className="my-link2" onClick={handleLogout}>로그아웃</Nav.Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Nav.Link as={Link} to="/signup" className="my-link2">회원가입</Nav.Link>
                                                    <Nav.Link as={Link} to="/signin" className="my-link2">로그인</Nav.Link>
                                                </>
                                            )}
                                        </Nav>
                                    </Col>
                                </Row>
                            )}
                        </Container>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    );
}

export default NavComponent;
