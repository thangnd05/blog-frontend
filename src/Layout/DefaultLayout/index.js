import classNames from "classnames/bind";
import style from "./DefaultLayout.module.scss"
import Header from "../Header";
import Footer from "../Footer";

const cx=classNames.bind(style)


function DefaultLayout({children}) {
    return(
        <div className={cx('Wrapper')}>
        <Header/>
        <div className={cx('content')}>
            {children}
        </div>
        <Footer/>

        </div>
    )
}
export default DefaultLayout;