import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect,useRef} from 'react';
import axios from 'axios';
import { Container, Form, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "../post/post.module.scss"; // Nếu có sử dụng CSS module
import JoditEditor from 'jodit-react';



const cx = classNames.bind(styles);

function Update() {
    const { postId } = useParams(); // Lấy postId từ URL
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: "", content: "" });
    const [isSaving, setIsSaving] = useState(false);



    const config={
        placeholder:'Nhập nội dung',
        height:400,
        textIcons: false,
        iframe: false,
        replaceNBSP: true, // Xóa các ký tự khoảng trắng không cần thiết
        removeEmptyBlocks: true // Xóa các thẻ rỗng 
      }
        const editor = useRef(null); 
      






    useEffect(() => {
        axios.get(`http://localhost:8080/api/posts/${postId}`)
          .then((response) => {
            setPost(response.data);
          })
          .catch(() => {
            alert("Không thể tải bài viết. Vui lòng thử lại.");
          });
      }, [postId]);
    
    const handleUpdate = (e) => {
      e.preventDefault(); // Ngăn chặn form submit mặc định
      
      if (isSaving) return;


      // Kiểm tra dữ liệu hợp lệ
      if (!post.title.trim() || !post.content.trim()) {
          alert("Tiêu đề và nội dung không được để trống.");
          return;
      }

      setIsSaving(true); // Bật trạng thái lưu dữ liệu
    //   const formattedContent = post.content.replace(/\n/g, '<br />'); // Xử lý xuống dòng
    //   const formDataWithContent = new FormData();

      const formDataWithContent = { 
        ...post, 
        content: post.content // Giữ nguyên nội dung không thay đổi
    };

    

      // Gửi request cập nhật bài viết
      axios.put(`http://localhost:8080/api/posts/${postId}`, formDataWithContent, {
          headers: { "Content-Type": "application/json" },  // Đảm bảo header đúng
      })
          .then((response) => {
              console.log("Cập nhật thành công:", response.data);
              alert("Bài viết đã được cập nhật thành công.");
              navigate("/"); // Quay về trang chủ
          })
          .catch((error) => {
              console.error("Lỗi cập nhật:", error.response?.data);
              alert(error.response?.data?.message || "Không thể cập nhật bài viết. Vui lòng thử lại.");
          })
          .finally(() => setIsSaving(false)); // Tắt trạng thái lưu dữ liệu
  };
      
   
      return (
        <Container>
            <div>
            <h1 className={cx("title", "py-5")} >Cập nhật bài viết</h1>
            <Form onSubmit={handleUpdate}>
                <Form.Group>
                    <Form.Label className={cx("tit")}>Tiêu đề:</Form.Label>
                    <Form.Control
                    className={cx("p-3", "post-title")}
                    type="text"
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className={cx("my-3")}>
                    <Form.Label className={cx("tit")}>Nội dung:</Form.Label>
                    <JoditEditor 
                        ref={editor} 
                        value={post.content} // Gắn giá trị với nội dung bài viết trong state
                        config={config} // Cấu hình của JoditEditor
                        onBlur={newContent => setPost({ ...post, content: newContent })} // Cập nhật nội dung khi mất focus
                        onChange={newContent => {}} // Có thể bỏ qua hoặc dùng nếu cần thiết
                    />
                </Form.Group>


                <Form.Group>
                    <Form.Label className={cx("tit")}>Ngày tạo:</Form.Label>
                    <Form.Control
                        className={cx("post-content")}
                        type="text"
                        value={post.created_at} 
                        readOnly
                    />
                </Form.Group>


                <Button 
                        // onClick={handleUpdate} 
                        variant="secondary"
                        className={cx("new-post", "my-5")}
                        type="submit">Cập nhật
                </Button>


                <Button onClick={() => navigate("/")} variant="secondary"
            className={cx("new-post", "my-5 mx-5")}
            type="button">Hủy</Button>
            </Form>
            </div>
        </Container>
      );
    }
    

export default Update;