import { Container } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./poliSer.module.scss"
const cx=classNames.bind(style)
function Policy() {  
    return(
        <Container className={cx('d-flex')}>
        <section className={cx('policy-wapper')}>
          <h1 >Chính Sách Sử Dụng</h1>
          <div>
            <h2>1. Quyền và Nghĩa Vụ của Người Dùng</h2>
            <ul>
              <li>Người dùng cần cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
              <li>Khi đặt tên tài khoản chỉ được tối đa 10 ký tự</li>
              <li>
                Nội dung do người dùng đăng tải phải tuân thủ pháp luật và không vi phạm quyền sở hữu trí tuệ.
              </li>
              <li>Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập.</li>
            </ul>
          </div>
          <div>
            <h2>2. Quyền và Nghĩa Vụ của Trang Web</h2>
            <ul>
              <li>
                Bảo mật thông tin cá nhân của người dùng, không chia sẻ với bên thứ ba nếu không được đồng ý.
              </li>
              <li>Có quyền kiểm duyệt và gỡ bỏ nội dung không phù hợp.</li>
              <li>Không chịu trách nhiệm về các tranh chấp pháp lý liên quan đến nội dung.</li>
            </ul>
          </div>
          <div>
            <h2>3. Nội Quy Cộng Đồng</h2>
            <ul>
              <li>Tôn trọng lẫn nhau, không sử dụng ngôn từ xúc phạm.</li>
              <li>
                Khuyến khích chia sẻ kiến thức chính xác, hữu ích cho cộng đồng.
              </li>
              <li>
                Cấm đăng tải nội dung liên quan đến bạo lực, phân biệt chủng tộc, hoặc thông tin độc hại.
              </li>
            </ul>
          </div>
        </section>
        </Container>
      );
    };
export default Policy;