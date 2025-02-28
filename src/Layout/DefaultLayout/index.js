import classNames from "classnames/bind";
import style from "./DefaultLayout.module.scss"
import Header from "../Header";
import Footer from "../Footer";
import ScrollToTop from "../SconllToTop";

const cx=classNames.bind(style)


function DefaultLayout({children}) {
    return(
        <div className={cx('Wrapper')}>
        <Header/>
        <div className={cx('content','container-lg')}>
            {children}

        </div>
        <Footer/>
        <ScrollToTop/>



        </div>
    )
}
export default DefaultLayout;