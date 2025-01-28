import Sibar from "../sibar";
import { Container,Button } from "react-bootstrap";
import TableCategory from "./tableCate.js";
import classNames from "classnames/bind";
import style from './../user/user.module.scss'
import { Link } from "react-router-dom";
import routes from "~/config";

const cx=classNames.bind(style)

function CategoryAdmin() {
    return <div className={cx("pt-5","wrapper")}>
    <Sibar/>
    <Container className="">
    <div className="d-flex justify-content-between">
        <h1 className={cx('pb-5','title')}>Quản lý danh mục</h1>
        
        <Link to={routes.createCategory} >
            <Button className={cx('add-btn')} variant="btn btn-outline-secondary">
                Thêm danh mục
            </Button>
        </Link>
      
    </div>
    <TableCategory/>
    </Container>
        
    </div>;
}

export default CategoryAdmin ;