import { Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import classNames from "classnames/bind";
import style from "./PageSearch.module.scss";
import AllSearch from "./SearchAll";


const cx = classNames.bind(style);

function PageSearch() {
    return (
        <div className={cx("wrapper", "p-5")}>
            <Container>
            <h1 className={cx("title", "p-3")}>Bài viết</h1>
                    <AllSearch/>
            </Container>
        </div>
    );
}

export default PageSearch;
