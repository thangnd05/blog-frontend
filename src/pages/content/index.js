import "bootstrap/dist/css/bootstrap.min.css";
import classNames from "classnames/bind";
import style from "./content.module.scss";
import PostItem from "./post/getItem/content";
import Category from "./category";
import SlideInfo from "./post/slide/slide";
const cx = classNames.bind(style);

function Content() {
    return (
        <div className={cx("wrapper")}>
                <Category/>
                <SlideInfo/>
                <PostItem />
        </div>
    );
}

export default Content;
