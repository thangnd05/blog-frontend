import { Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import classNames from "classnames/bind";
import style from "./content.module.scss";
import PostItem from "./post/getItem/content";
import Category from "./category";
const cx = classNames.bind(style);

function Content() {
    return (
        <div className={cx("wrapper", "p-5")}>
            <Container>
                <Category/>
                <PostItem />
            </Container>
        </div>
    );
}

export default Content;
