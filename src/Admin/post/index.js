import { Button, Container } from "react-bootstrap";
import Sibar from "../sibar";
import classNames from "classnames/bind";
import PostTable from "./table";
import style from './../user/user.module.scss'
import { Link } from "react-router-dom";
import routes from "~/config";

const cx=classNames.bind(style)

function AdminPost() {
    return (
        <div className={cx("pt-5","wrapper")}>
            <Sibar/>
            <Container className="">
            <div className="d-flex justify-content-between">
                <h1 className={cx('pb-5','title')}>Quản lý bài viết</h1>
                
                <Link to={routes.post}>
                    <Button className={cx('add-btn')} variant="btn btn-outline-secondary">
                        Thêm bài viết
                    </Button>
                </Link>
            
            </div>
            <PostTable/>
            </Container>                   
        </div>
    )
}

export default AdminPost;