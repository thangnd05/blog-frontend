import { useContext } from "react";
import { UserContext } from "~/pages/user/IsLogin";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faNewspaper, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import routes from "~/config";
import classNames from "classnames/bind";
import style from "./sibar.module.scss"

const cx=classNames.bind(style)

function SibarProFile() {
  const { logout } = useContext(UserContext);

  return (
    <div
      className={cx("p-3 border border-secondary justify-content-center flex-column gap-3","sibar-wrap")}
      role="navigation"
      aria-label="Menu chính"
    >
      <Link
        to={routes.userPost}
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Bài viết"
      >
        <FontAwesomeIcon icon={faNewspaper} className="mx-2" /> Bài viết
      </Link>

      <Link
        to={routes.userComment}
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Bình luận"
      >
        <FontAwesomeIcon icon={faComment} className="mx-2" /> Bình luận
      </Link>

      <Link
        onClick={logout}
        to={routes.home}
        className="d-flex align-items-center mt-3 mt-md-0 text-nowrap"
        aria-label="Đăng xuất"
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="mx-2" /> Đăng xuất
      </Link>
    </div>
  );
}

export default SibarProFile;
