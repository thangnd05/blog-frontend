import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import classNames from 'classnames/bind';
import style from "./slide.module.scss"
import { Link } from 'react-router-dom';

const cx=classNames.bind(style)
function SlideInfo() {
  return (
    <Carousel  className={cx("mt-5")}>
      <Carousel.Item>
        {/* <SlideImage src={images.avtImage} alt="First slide" /> */}
        <div className={cx("inf2","w-100 h-100")}>
          <div className={cx("info","h-100")}>
          <p>Github </p>
              <Link to={"https://github.com/thangnd05"}>
              <button className={cx("btn-info","git","rounded-pill")}>Chuyển tới</button>             
            </Link>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className={cx("inf3","w-100 h-100")}>
          <div className={cx("info","h-100")}>
                <p>Email</p>
                <Link to={"https://mail.google.com/mail/?view=cm&fs=1&to=thangnd.contact@gmail.com"}>
                <button className={cx("btn-info","rounded-pill")}>Liên hệ</button>       
                </Link>
            </div>  
        </div>       
      </Carousel.Item> 

      <Carousel.Item>
        <div className={cx("inf","w-100 h-100")}>
          <div className={cx("info","h-100")}>
              <p>Linkedin </p>
              <Link to={"https://www.linkedin.com/in/nguy%E1%BB%85n-%C4%91%E1%BB%A9c-th%E1%BA%AFng-532709353/"}>
              <button className={cx("btn-info","git","rounded-pill")}>Chuyển tới</button>       
              </Link>
          </div>        
        </div>

      </Carousel.Item>

      
    </Carousel>
  );
}

export default SlideInfo;
