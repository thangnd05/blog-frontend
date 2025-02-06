import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect,useRef} from 'react';
import axios from 'axios';
import { Container, Form, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "../post/post.module.scss"; // Nếu có sử dụng CSS module
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const cx = classNames.bind(styles);

function CommentUpdate(){
    const { commentId } = useParams(); // Lấy postId từ URL
    const navigate = useNavigate();
    const [comment, setComment] = useState({ content: "" });
    const [isSaving, setIsSaving] = useState(false);

    const quillRef = useRef();


    useEffect(()=>{
        axios.get(`http://localhost:8080/api/comment/${commentId}`)
        .then((response)=>{
            setComment(response.data)           
        })
        .catch(() => {
            alert("Không thể tải bài viết. Vui lòng thử lại.");
          });
    },[commentId])


    const handleUpdate=(e)=>{
        e.preventDefault(); // Ngăn chặn form submit mặc định

        if(isSaving) return;

        if (!comment.content.trim()) {
            alert("Nội dung bình luận không được để trống.");
            return;
        }
        setIsSaving(true)

        axios.put(`http://localhost:8080/api/comment/${commentId}`,comment)
        .then((response)=>{
            alert("Cập nhật thành công");
            navigate("/"); // Quay về trang chủ

        }).catch((error) => {
              console.error("Lỗi cập nhật:", error.response?.data);
              alert(error.response?.data?.message || "Không thể cập nhật bài viết. Vui lòng thử lại.");
          }).finally(() => setIsSaving(false)); // Tắt trạng thái lưu dữ liệu


    }



    return(
        <Container>
        <div>
        <h1 className={cx("title", "py-5")} >Cập nhật bình luận</h1>
            <Form onSubmit={handleUpdate}>

                <Form.Group className={cx("quill")}>
                    <ReactQuill
                        ref={quillRef}
                        className={cx("custom-quill")}
                        value={comment.content}
                        onChange={(value) => {
                            if (value === "<p><br></p>") {
                            setComment({ ...comment, content: "" }); // Xóa nội dung rỗng
                            } else {
                            setComment({ ...comment, content: value });
                            }
                        }}                        
                        required
                        style={{minHeight:"150px",fontSize:"20px"}}
                    />
                </Form.Group>

            
                <Form.Group>
                    <Form.Label className={cx("tit")}>Ngày tạo:</Form.Label>
                    <Form.Control
                        className={cx("post-content")}
                        type="text"
                        value={comment.created_at} 
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
    )

}
export default CommentUpdate;