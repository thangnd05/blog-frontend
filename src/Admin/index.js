import { Container } from "react-bootstrap";
import Sibar from "./sibar";
import All from "./All";
import classNames from "classnames/bind";
import style from "./user/user.module.scss"
const cx=classNames.bind(style)
function Admin() {
        return <div className={cx("pt-5","wrapper")}>
        <Sibar/>       
        <Container>             
                <h1 style={{paddingTop:'20px',fontWeight:'700'}}>Welcom to return Admin Page 's EDT</h1>
                <All/>
        </Container>
        </div>
}

export default Admin;