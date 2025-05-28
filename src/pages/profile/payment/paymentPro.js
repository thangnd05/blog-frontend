import { Container} from "react-bootstrap";
import style from "../post/user.module.scss"
import "bootstrap/dist/css/bootstrap.min.css"
import SibarProFile from "../sibar/sibarProFile";
import classNames from "classnames/bind";
import Payment from "./payment";
const cx=classNames.bind(style)

function PaymentMembership() {
    return <div className={cx("pt-5","wrapper")}>
    <SibarProFile/>
    <Container>
    <div className="d-flex justify-content-between">
            <h1 className={cx('pb-2','title')}>Thanh toán VIP Membership</h1>     
    </div>

        <Payment/>
    </Container>       
    </div>;
}

export default PaymentMembership;