import { useState, useEffect } from "react";
import axios from 'axios';
import { fetchUserId } from "~/hook/service";
import { Container } from "react-bootstrap";
import style from "../post/user.module.scss"
import classNames from "classnames/bind";

const cx=classNames.bind(style)



const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId,setUserId]=useState("")

   useEffect(() => {
          fetchUserId(setUserId);
      }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/vnpay/create-payment/${userId}`
      );
      if (response.data) {
        // window.open(response.data, '_blank');
        window.location.href = response.data;

      } else {
        setError('Không nhận được URL thanh toán');
      }
    } catch (err) {
      setError(err.response?.data || 'Lỗi khi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={cx("d-flex w-100")}>
      <section className={cx('')}>
        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
        </button>
        {error && <p style={{ color: 'red' }} className={cx("mt-3")}>{error}</p>}





      </section>

      
    </Container>
  );
};

export default Payment;