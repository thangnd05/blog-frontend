import React, { useState,useRef,useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./post.module.scss"; // Nếu có sử dụng CSS module
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchUserId } from "~/hook/service";
import JoditEditor from 'jodit-react';



const cx = classNames.bind(styles);

function Post() {
  const editor = useRef(null); 
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null); // Lưu userId


  const [category, setCategory] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Chưa chọn tệp"); // Lưu tên tệp đã chọn
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();


  //dùng để chỉnh chỗ nhập chỗ content
  const config={
    placeholder:'Nhập nội dung',
    height:400,
    textIcons: false,
    iframe: false,
    replaceNBSP: true, // Xóa các ký tự khoảng trắng không cần thiết
    removeEmptyBlocks: false, // Xóa các thẻ rỗng 
  }

  useEffect(() => {
    axios.get(`http://localhost:8080/api/category`)
      .then((res) => {
        setCategory(res.data); // Lưu danh sách danh mục
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "Chưa chọn tệp");
  };
  
//lay du lieu thong tin nguoi dung
  useEffect(() => {
          fetchUserId(setUserId); // Gọi hàm và truyền `setUserId`
      }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Ngăn ngừa gửi nhiều lần
  setIsSubmitting(true);

    if (!userId) {
      alert("Bạn cần đăng nhập để tạo bài viết.");
      return navigate("/login");
    }

    // Xử lý xuống dòng cho nội dung bài viết
    const formattedContent = content.replace(/\n/g, '<br />'); // Xử lý xuống dòng
    const formDataWithContent = new FormData();

    // Thêm dữ liệu vào FormData
    formDataWithContent.append("title", title);
    formDataWithContent.append("content", formattedContent);
    formDataWithContent.append("userId", userId); // Sử dụng userId từ state
    formDataWithContent.append("categoryId", categoryId);
    if (file) formDataWithContent.append("file", file);

    // Gửi dữ liệu lên server
    axios
      .post("http://localhost:8080/api/posts", formDataWithContent, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Tạo bài viết thành công!");
        setContent("");
        setTitle("");
        setCategoryId("");
        setFile(null);
        navigate("/"); // Quay lại trang chính sau khi tạo bài viết
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau và báo cáo với admin.");
      });
  };
const handleCategoryChange = (e) => {
  setCategoryId(e.target.value); // Cập nhật categoryId
  // console.log(e.target.value); // Log giá trị mới của categoryId
};



 
  return (
    <Container>
      <div>
        <h1 className={cx("title", "py-5")}>Thêm bài viết</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className={cx("my-3")}>
            <Form.Label className={cx("tit")}>Tiêu đề</Form.Label>
            <Form.Control
              className={cx("p-3", "post-title")}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              type="text"
              placeholder="Nhập tiêu đề"
            />
          </Form.Group>

          <Form.Group className={cx("my-3")} >
          <Form.Label className={cx("tit")}>Nội dung</Form.Label>
            <JoditEditor 
              ref={editor} 
              value={content} 
              config={config}
              onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={newContent => {}}          
              />

               
          </Form.Group>

          <Form.Group>
  <Form.Label className={cx("tit")}>Danh mục</Form.Label>
  <Form.Select
    as="select"
    className={cx("p-3", "categories", "categoryName")}
    value={categoryId}
    onChange={handleCategoryChange}
    >
    <option value="">Chọn danh mục</option>
    {category.map((category) => (
      <option key={category.category_id} value={category.category_id}>
        {category.categoryName} {/* Hiển thị tên danh mục */}
      </option>
    ))}
  </Form.Select>
</Form.Group>




          <Form.Group className={cx("my-3")} > 
          <div>
            <Form.Label className={cx("text-danger",'danger')}>Bạn có thể chọn ảnh cho phù hợp yêu cầu với nội dung nếu bạn để trống thì sẽ hình ảnh đó sẽ được sử dụng hình ảnh mặc định trang web </Form.Label>
          </div>
            <Form.Label className={cx("tit")}>Hình ảnh</Form.Label>          
          <div>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput">
              {fileName}
            </label>
            <Button
              variant="outline-secondary"
              onClick={() => document.getElementById("fileInput").click()}
              className={cx("image-file","mx-3")}
            >
              Chọn tệp
            </Button>
          </div>
        </Form.Group>
          <Button
            variant="secondary"
            className={cx("new-post", "my-5")}
            type="submit"
          >
            Tạo bài viết
          </Button>
        </Form>
      </div>
    </Container>
  );
}


export default Post;
