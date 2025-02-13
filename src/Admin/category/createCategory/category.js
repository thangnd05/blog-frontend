import axios from "axios";
import { useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./createCate.module.scss"; // Nếu có sử dụng CSS module
import { useNavigate } from "react-router-dom";
import routes from "~/config";

const cx = classNames.bind(styles);

function CreateCategory() {
  const [category, setCategory] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();


    const formDataWithCategory = new FormData();
    formDataWithCategory.append("categoryName", category);

    axios
      .post("http://192.168.100.205:8080/api/category", formDataWithCategory)
      .then((response) => {
        alert("Tạo danh mục thành công!");
        setCategory(""); 
        navigate(routes.adminCategory)
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "Đã xảy ra lỗi khi tạo danh mục. Vui lòng thử lại sau và báo cáo với admin."
        );
      });
  };

  return (
    <Container>
      <div>
        <div className={cx("title", "py-5")}>
          Thêm danh mục
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className={cx("tit")}>Danh mục</Form.Label>
            <InputGroup>
              <Form.Control
                className={cx("category")}
                placeholder="Nhập tên danh mục"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Button
            variant="secondary"
            className={cx("new-post", "my-5")}
            type="submit"
          >
            Tạo danh mục
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default CreateCategory;
