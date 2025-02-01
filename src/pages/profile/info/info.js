import { Container} from "react-bootstrap";
import style from "./../post/user.module.scss"
import "bootstrap/dist/css/bootstrap.min.css"
import SibarProFile from "../sibar/sibarProFile";
import classNames from "classnames/bind";
import InfoProfileTable from "./infoTable";
const cx=classNames.bind(style)

function InfoProfile() {
    return <div className={cx(" pt-5","wrapper")}>
    <SibarProFile/>
    <Container>
    <div className="d-flex justify-content-between">
        <h1 className={cx('pb-2','title')}>Thông tin của bạn</h1>     
    </div>
    <InfoProfileTable/>
    </Container>       
    </div>;
}

export default InfoProfile;