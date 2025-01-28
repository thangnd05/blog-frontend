import { Button, Container} from "react-bootstrap";
import Sibar from "../sibar";
import classNames from "classnames/bind";
import style from "./user.module.scss"
import UserTable from "./table";
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom";

const cx=classNames.bind(style)

function User() {
    return <div className={cx("pt-5","wrapper")}>
    <Sibar/>
    <Container>
    <div className="d-flex justify-content-between">
        <h1 className={cx('pb-5','title')}>Quản lý người dùng</h1>
        
        <Link to={`/register`}>
            <Button className={cx('add-btn')} variant="btn btn-outline-secondary">
                Thêm người dùng
            </Button>
        </Link>
      
    </div>
    <UserTable/>
    </Container>
        
    </div>;
}

export default User;