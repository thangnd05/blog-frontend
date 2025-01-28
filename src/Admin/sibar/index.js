import { faComment, faHome, faLayerGroup, faNewspaper, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "~/pages/user/IsLogin";
import routes from "~/config";
import classNames from "classnames/bind";
import style from "./sibar.module.scss"

const cx=classNames.bind(style)

function Sibar() {
      const { logout } = useContext(UserContext); 
    
    return (
    <div
      className={cx("p-3 border border-secondary justify-content-center flex-column gap-3","sibar-wrap")}
      role="navigation"
      aria-label="Menu chính"
    >        <Link to={routes.admin} 
    className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
    aria-label="Trang chủ">
            <FontAwesomeIcon icon={faHome} className="mx-3" /> Trang chủ
        </Link>
    
        <Link to={routes.adminUser} 
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Người dùng">
            <FontAwesomeIcon icon={faUser} className="mx-3" /> Người dùng
        </Link>
    
        <Link to={routes.adminPost} 
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Bài viết">
            <FontAwesomeIcon icon={faNewspaper} className="mx-3" /> Bài viết
        </Link>
    
        <Link to={routes.adminCategory} 
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Thể loại">
            <FontAwesomeIcon icon={faLayerGroup} className="mx-3" /> Danh mục
        </Link>
    
        <Link to={routes.adminComment} 
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Bình luận">
            <FontAwesomeIcon icon={faComment} className="mx-3" /> Bình luận
        </Link>
    
        <Link onClick={logout} to={routes.home} 
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Đăng xuất">
            <FontAwesomeIcon icon={faRightFromBracket} className="mx-3" /> Đăng xuất
        </Link>
    </div>
    
    

    )
}

export default Sibar;