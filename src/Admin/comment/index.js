import {  Container } from "react-bootstrap";
import Sibar from "../sibar";
import classNames from "classnames/bind";
import ComTable from "./comTable";
import style from './../user/user.module.scss'

const cx=classNames.bind(style)
function AdminComment() {
    return <div className={cx("pt-5","wrapper")}>
    <Sibar/>
    <Container className="">
        <h1 className={cx('pb-5','title')}>Quản lý bình luận</h1>
             
    <ComTable/>
    </Container>
        
    </div>;
}

export default AdminComment;