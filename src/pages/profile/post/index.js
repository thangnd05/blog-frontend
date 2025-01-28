import { Container} from "react-bootstrap";
import style from "./user.module.scss"
import "bootstrap/dist/css/bootstrap.min.css"
import SibarProFile from "../sibar/sibarProFile";
import classNames from "classnames/bind";
import PostTabeProFile from "./postTabel";
const cx=classNames.bind(style)

function PostProFile() {
    return <div className={cx("pt-5","wrapper")}>
    <SibarProFile/>
    <Container>
        <div className="d-flex justify-content-between">
            <h1 className={cx('pb-2','title')}>Bài viết của bạn</h1>     
        </div>
        <div className={cx('pb-2 fs-4 text-danger fw-bold') }>Lưu ý: Nếu bài viết của bạn đang được chờ duyệt mà lại biến mất có nghĩa là bài viết đó đã bị từ chối duyệt</div>
        <PostTabeProFile/>
    </Container>       
    </div>;
}

export default PostProFile;