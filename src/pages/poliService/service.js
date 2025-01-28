import { Container } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./poliSer.module.scss";
const cx = classNames.bind(style);

function Service() {
  return (
    <Container className={cx("d-flex")}>
      <section className={cx("service-wapper")}>
        <h1>Dịch Vụ Người Dùng</h1>
        <div>
          <h2>1. Dịch Vụ Chia Sẻ Kiến Thức</h2>
          <ul>
            <li>Người dùng có thể đăng tải bài viết, tài liệu hoặc video.</li>
            <li>Nội dung được phân loại theo các lĩnh vực đa dạng.</li>
            <li>Hỗ trợ bình luận, đánh giá và chia sẻ nội dung.</li>
            <li>Cung cấp các công cụ hỗ trợ để chỉnh sửa và làm mới nội dung bài viết.</li>
            <li>Đảm bảo tính chính xác của các bài viết thông qua hệ thống kiểm duyệt.</li>
          </ul>
        </div>
        <div>
          <h2>2. Dịch Vụ Hỏi Đáp</h2>
          <ul>
            <li>Cung cấp khu vực hỏi đáp cho người dùng.</li>
            <li>Cho phép bình chọn câu trả lời tốt nhất.</li>
            <li>Hỗ trợ trả lời câu hỏi từ cộng đồng</li>
          </ul>
        </div>
        
        
      </section>
    </Container>
  );
}

export default Service;
