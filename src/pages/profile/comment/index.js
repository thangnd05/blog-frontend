import { Container} from "react-bootstrap";
import classNames from "classnames/bind";
import "bootstrap/dist/css/bootstrap.min.css"
import SibarProFile from "./../sibar/sibarProFile";
import ComProFileTable from "./comPro";
import style from './../post/user.module.scss';


const cx=classNames.bind(style)

function CommentProFile() {
    return <div className={cx(" pt-5","wrapper")}>
    <SibarProFile/>
    <Container>
    <div className="d-flex justify-content-between">
        <h1 className={cx('pb-2','title')}>Bình luận của bạn</h1>     
    </div>
    <ComProFileTable/>
    </Container>       
    </div>;
}

export default CommentProFile;