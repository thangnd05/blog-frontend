import "bootstrap/dist/css/bootstrap.min.css";
import classNames from "classnames/bind";
import style from "./PageSearch.module.scss";
import AllSearch from "./SearchAll";


const cx = classNames.bind(style);

function PageSearch() {
    return (
        <div className={cx("wrapper")}>
            <h1 className={cx("title", "p-3")}>Bài viết</h1>
                    <AllSearch/>
        </div>
    );
}

export default PageSearch;
