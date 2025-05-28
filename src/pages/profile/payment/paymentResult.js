import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import style from '../post/user.module.scss';
import classNames from 'classnames/bind';
import routes from "~/config";


const cx = classNames.bind(style);

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params = {};
    queryParams.forEach((value, key) => {
      params[key] = value;
    });

    const checkPaymentStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/vnpay/payment-callback', {
          params,
        });
        setMessage(response.data);
        setTimeout(() => navigate(routes.payment), 3000); // Chuyển hướng sau 3 giây
      } catch (error) {
        console.error('Lỗi khi kiểm tra thanh toán:', error);
        setError('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.');
      }finally{
        setLoading(false);
      }
    };

    if (Object.keys(params).length > 0) {
      checkPaymentStatus();
    } else {
      setError('Không tìm thấy thông tin thanh toán.');
      setLoading(false);
      setTimeout(() => navigate(routes.payment), 3000); // Chuyển hướng sau 3 giây
    }
  }, [location, navigate]);

  return (
  <Container className={cx('pt-5')}>
    <div className="alert alert-secondary" role="alert">
      <h2>{loading ? 'Đang xử lý...' : message}</h2>
      {error && <p style={{ color: 'red' }} className={cx('mt-3')}>{error}</p>}
      <hr />
      <p className="mb-0">
        Bạn sẽ được chuyển hướng về trang thanh toán trong vài giây...
      </p>
    </div>
  </Container>
)
}


export default PaymentResult;