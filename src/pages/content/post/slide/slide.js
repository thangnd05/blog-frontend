import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import classNames from 'classnames/bind';
import style from "./slide.module.scss"
import { Link,useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { fetchUserId } from "~/hook/service";
import routes from '~/config';
import images from '~/assets/images';

const cx=classNames.bind(style)
function SlideInfo() {
  const [loading, setLoading] = useState(false);
  const [userId,setUserId]=useState("")

   useEffect(() => {
          fetchUserId(setUserId);
      }, []);

    const navigate = useNavigate();
      

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/vnpay/create-payment/${userId}`
      );
      if (response.data) {
        window.open(response.data, '_blank');
      } else {
      }
    } catch (err) {
      if(userId === null){
        alert("Người dùng cần đăng nhập để nâng cấp thành viên VIP ")
        navigate(routes.login)
        return;

      }
      alert("Người dùng đã nâng cấp thành viên VIP rồi")
    } finally {
      setLoading(false);
    }
  };




  return (
    <Carousel className={cx("mt-5","carousel")}>
      <Carousel.Item >
        <div style={{backgroundImage: `url(${images.membership})`}} className={cx("inf","w-100 h-100")}>
          <div className={cx("info","h-100")}>
              <p>Nâng cấp thành viên </p>
              <button className={cx("git1","rounded-pill")} 
              onClick={handlePayment}
              disabled={loading}
              >
              Mở VIP
              </button>
                  
          </div>        
        </div>

      </Carousel.Item>


      <Carousel.Item >
        <div className={cx("inf3","w-100 h-100")}>
          <div className={cx("info","h-100")}>
                <p>Email</p>
                <Link to={"https://mail.google.com/mail/?view=cm&fs=1&to=thangnd.contact@gmail.com"}>
                <button className={cx("btn-info","rounded-pill")}>Liên hệ</button>       
                </Link>
            </div>  
        </div>       
      </Carousel.Item>

      <Carousel.Item >
        <div className={cx("inf2","w-100 h-100")}>
          <div className={cx("info","h-100")}>
          <p>Github </p>
              <Link to={"https://github.com/thangnd05"}>
              <button className={cx("btn-info","git","rounded-pill")}>Chuyển tới</button>             
            </Link>
          </div>
        </div>
      </Carousel.Item>
       

      

      
    </Carousel>
  );
}

export default SlideInfo;
