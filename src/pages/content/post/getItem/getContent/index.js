import { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./getContent.module.scss";
import Comment from "~/Layout/comment";
import DOMPurify from "dompurify";

const cx = classNames.bind(style);

function GetContent() {
  const [data, setData] = useState(null); // Lưu bài viết và thông tin người dùng
  const [error, setError] = useState(null); // Lưu thông báo lỗi
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy bài viết theo ID
        const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`);
        const postData = postResponse.data;

        // Gọi API lấy thông tin người dùng
        const userResponse = await axios.get(`http://localhost:8080/api/user/${postData.userId}`);
        const enrichedData = {
          ...postData,
          user: { username: userResponse.data.username || "Anonymous" },
        };

        setData(enrichedData); // Cập nhật dữ liệu bài viết
        setError(null); // Xóa lỗi nếu thành công
      } catch (err) {
        if (err.response) {
          const { status, data } = err.response;
          if (status === 401 && data.loginRequired) {
            // Xử lý lỗi 401: Yêu cầu đăng nhập
            setError({
              message: data.message, // "Bạn cần đăng nhập để xem bài viết này."
              loginRequired: true,
              loginLink: data.loginLink, // "/login"
            });
          } else if (status === 403 && data.upgradeRequired) {
            // Xử lý lỗi 403: Yêu cầu nâng cấp
            setError({
              message: data.message, // "Bạn không có quyền đọc bài viết này. Vui lòng nâng cấp thành viên."
              upgradeRequired: true,
              upgradeLink: data.upgradeLink, // "/nang-cap"
            });
          } else if (status === 404) {
            // Xử lý lỗi 404: Bài viết không tồn tại
            setError({ message: data.message || "Bài viết không tồn tại" });
          } else {
            setError({ message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
          }
        } else {
          setError({ message: "Không thể kết nối đến server. Vui lòng thử lại sau." });
        }
      }
    };

    fetchData();
  }, [id]);

  // Xử lý chuyển hướng sau khi hiển thị thông báo
  useEffect(() => {
    if (error && error.loginRequired) {
      // Hiển thị alert và chuyển hướng đến trang đăng nhập
      alert(error.message);
      navigate(error.loginLink);
    } else if (error && error.upgradeRequired) {
      // Hiển thị alert cho nâng cấp (không chuyển hướng tự động, để người dùng nhấp vào link)
      alert(error.message);
    }
  }, [error, navigate]);

  return (
    <div>
      <Container>
        {error ? (
          <div className={cx("text-secondary", "text-center", "mt-3")}>
            {error.message}
            {error.upgradeRequired && (
              <>
                {" "}
                <Link to={error.upgradeLink} className={cx("fw-bold", "text-secondary")}>
                  Nâng cấp tại đây
                </Link>.
              </>
            )}
            {error.loginRequired && (
              <>
                {" "}
                <Link to={error.loginLink} className={cx("fw-bold", "text-secondary")}>
                  Đăng nhập tại đây
                </Link>.
              </>
            )}
          </div>
        ) : data ? (
          <>
            <div key={data.post_id}>
              <div className={cx("w-100 d-flex justify-content-center")}>
                <div className={cx("title", "d-flex justify-content-center")}>{data.title}</div>
              </div>

              {/* dangerouslySetInnerHTML: dùng để đọc được thẻ HTML do post mang đến */}
              <div
                className={cx("content", "pt-3")}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
              />

              <div className={cx("d-flex justify-content-between")}>
                <div className="">
                  <span className={cx("content")}>Tác giả</span>
                  <div className={cx("d-flex justify-content-between w-100")}>
                    <div className={cx("text-secondary")}>
                      {data.user && data.user.username ? data.user.username : "Anonymous"}
                    </div>
                  </div>
                </div>
                <div className="">
                  <span className={cx("content")}>Ngày đăng</span>
                  <div className={cx("d-flex justify-content-between w-100")}>
                    <div className={cx("text-secondary")}>{data.created_at}</div>
                  </div>
                </div>
              </div>
            </div>
            <Comment /> {/* Thành phần bình luận chỉ hiển thị khi có quyền đọc */}
          </>
        ) : (
          <div className={cx("text-secondary", "text-center", "mt-3")}>Đang tải...</div>
        )}
      </Container>
    </div>
  );
}

export default GetContent;