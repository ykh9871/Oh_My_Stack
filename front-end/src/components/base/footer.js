import React from "react";
import '../../components/style/footer.css';

const Footer = () => {
    return (
        <>
            {/* <section>Footer Example 4</section> */}
            <footer className="footer-distributed clearfix">

                <div className="footer-left">

                    <div className="footer-logo">Oh My Stack!</div>

                    <p className="footer-links">
                        <a href="#" className="link-1">Home</a>

                        <a href="#">Blog</a>

                        <a href="#">Pricing</a>

                        <a href="#">About</a>

                        <a href="#">Faq</a>

                        <a href="#">Contact</a>
                    </p>

                    <p className="footer-company-name">Copyright©2023 Stackful All rights reserved.</p>
                </div>

                <div className="footer-center">

                    <div>
                        <i className="fa fa-map-marker"></i>
                        <p><span>G밸리캠퍼스</span>가산디지털1로 25 대륭테크노타운 17차 18층 플레이데이터</p>
                    </div>

                    <div>
                        <i className="fa fa-phone"></i>
                        <p>Tel : 010-1234-5678</p>
                    </div>

                    <div>
                        <i className="fa fa-envelope"></i>
                        <p><a href="https://github.com/Atopiano/Final_Front_End">OhMyStack@github.io</a></p>
                    </div>

                </div>

                <div className="footer-right">

                    <p className="footer-company-about">
                        <span>About the company</span>
                        LET'S STACK!
                    </p>

                    <div className="footer-icons">

                        <a href="#"><i className="fa fa-facebook"></i></a>
                        <a href="#"><i className="fa fa-twitter"></i></a>
                        <a href="#"><i className="fa fa-linkedin"></i></a>
                        <a href="https://github.com/Atopiano/Final_Front_End"><i className="fa fa-github"></i></a>

                    </div>

                </div>

            </footer>

        </>
    );
}


export default Footer;