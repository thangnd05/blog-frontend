import { useState, useEffect, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./comment.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchUserId } from "~/hook/service";
import { useParams } from "react-router-dom";
import DOMPurify from 'dompurify';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const cx = classNames.bind(style);

function Comment() {
    const [comment, setComment] = useState("");
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEdit,setIsEdit] =useState(false)
    const [newComment, setnewComment] = useState(""); // Nội dung mới của bình luận
    const quillRef = useRef();

    const navigate = useNavigate();
    const { id } = useParams();
    

    

    // Lấy dữ liệu bình luận
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
                const commentsWithUsers = await Promise.all(
                    response.data.map(async (comment) => {
                        try {
                            const userResponse = await axios.get(`http://localhost:8080/api/user/${comment.userId}`);
                            return { ...comment, user: { username: userResponse.data.username } };
                        } catch {
                            return { ...comment, user: { username: "Anonymous" } };
                        }
                    })
                );
                setData(commentsWithUsers);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [id]);

    useEffect(() => {
        fetchUserId(setUserId); // Gọi hàm và truyền `setUserId`
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!userId) {
            alert("Bạn cần đăng nhập để bình luận.");
            return navigate("/login");
        }
        if (!comment.trim()) {
            alert("Nội dung bình luận không được để trống.");
            return;
        }
        try {
            // Gửi bình luận mới
            const response = await axios.post("http://localhost:8080/api/comment", {
                content: comment,
                userId: userId,
                postId: id,  // Đảm bảo bạn đang truyền id từ useParams nhung dung vs be
            });
    
            // Reset comment input
            setComment("");
    
            // Fetch lại thông tin người dùng và bình luận để cập nhật danh sách
            const userResponse = await axios.get(`http://localhost:8080/api/user/${userId}`);
            const newComment = {
                ...response.data,
                user: { username: userResponse.data.username },
            };
    
            // Thêm bình luận mới vào danh sách
            setData((prev) => [...prev, newComment]);
    
        } catch (error) {
            console.error("Đã xảy ra lỗi khi gửi bình luận:", error);
        }
    };


    const deleteComment = (commentId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            setIsDeleting(true); // Bắt đầu trạng thái đang xóa
            axios
                .delete(`http://localhost:8080/api/comment/${commentId}`)
                .then(() => {
                    // Cập nhật lại danh sách sau khi xóa React sẽ render lại giao diện để 
                    // hiển thị danh sách bình luận đã được cập nhật. Bình luận có
                    setData((prevData) => prevData.filter((comment) => comment.comment_id !== commentId));
                    alert("Bình luận đã được xóa thành công.");
                })
                .catch((error) => {
                    alert("Không thể xóa bình luận này. Vui lòng thử lại.");
                })
                .finally(() => {
                    setIsDeleting(false); // Kết thúc trạng thái xóa
                });
        }
    };
    
    const handleEdit = (commentId, currentContent) => {
        setIsEdit(commentId); // Đặt ID của bình luận đang sửa
        setnewComment(currentContent); // Gán nội dung hiện tại vào Quill
    
        setTimeout(() => {
            if (quillRef.current) {
                const editor = quillRef.current.getEditor(); // Lấy đối tượng Quill
                editor.focus(); // Focus vào editor
                
                // Đưa con trỏ đến cuối văn bản
                const length = editor.getLength(); // Lấy độ dài nội dung
                editor.setSelection(length, length);
            }
        }, 0); // Đảm bảo focus sau khi render
    };
    
    
    // Hàm lưu bình luận đã sửa
    const handleSave = (commentId) => {
        if (!newComment.trim()) {
            alert("Vui lòng nhập nội dung bình luận.");
            return; // Ngừng thực hiện nếu nội dung trống
        }
        axios
            .put(`http://localhost:8080/api/comment/${commentId}`, { content: newComment })
            .then(() => {
                // Cập nhật danh sách bình luận
                setData((prevData) =>
                    prevData.map((comment) =>
                        comment.comment_id === commentId ? { ...comment, content: newComment } : comment
                    )
                );
                setIsEdit(null); // Thoát chế độ sửa
                alert("Bình luận đã được sửa thành công.");
            })
            .catch(() => {
                alert("Không thể sửa bình luận. Vui lòng thử lại.");
            });
    };
    

    return (

        <Container className={cx("wrapper")}>
            <Form onSubmit={handleSubmit}>

            {!isEdit && (
                <Form.Group className={cx("quill")}>
                    <Form.Label className={cx("title")}>Bình luận</Form.Label>
                    <ReactQuill
                        className={cx("comment","h-100","fs-com")}
                        value={comment}
                        onChange={(value) => {
                            // Kiểm tra và loại bỏ nội dung <p><br></p>
                            if (value === "<p><br></p>") {
                                setComment("");  // Xóa nội dung trống
                            } else {
                                setComment(value);  // Cập nhật giá trị bình luận
                            }
                        }}        required
                        placeholder="Nhập bình luận"
                        style={{ minHeight: "180px"}}  // Bạn có thể điều chỉnh theo ý muốn
                        modules={{
                            toolbar: false,  // Tắt toolbar, chỉ cho phép nhập văn bản
                        }}
                        theme="bubble" // Thay vì "snow", dùng "bubble" sẽ không có viền

                    />
                    <Button
                    variant="secondary"
                    className={cx("new-comment", "my-4 px-5 text-center")}
                    type="submit"
                >
                    Gửi
                </Button>
                </Form.Group>
            )}

                
                
            </Form>

            <div className={cx("comment-show", "d-block")}>
    {data.length > 0 ? (
        data.map((cmt) => (
            <div key={cmt.comment_id} className={cx("mb-3")}>
                <div className={cx("author")}>{cmt.user?.username || "Anonymous"}</div>
                <div className={cx("")}>
                    {isEdit === cmt.comment_id ? (
                        <div className={cx("w-100" )}>
                            
                        <Form className={cx('w-100')}>
                            <Form.Group className={cx("quill")}>
                                <ReactQuill
                                    className={cx("comment","h-100","fs-com")}
                                    value={newComment}
                                    onChange={(value) => {
                                        // Kiểm tra và loại bỏ nội dung <p><br></p>
                                        if (value === "<p><br></p>") {
                                            setnewComment("");  // Xóa nội dung trống
                                        } else {
                                            setnewComment(value);  // Cập nhật giá trị bình luận
                                        }
                                    }}        required
                                    placeholder="Nhập bình luận"
                                    style={{ minHeight: "150px"}}  // Bạn có thể điều chỉnh theo ý muốn
                                    modules={{
                                        toolbar: false,  // Tắt toolbar, chỉ cho phép nhập văn bản
                                    }}
                                    theme="bubble" // Thay vì "snow", dùng "bubble" sẽ không có viền
                                    ref={quillRef}

                                />
                            </Form.Group>
                        </Form>    
                            <div className={cx("d-flex mt-3")}>
                                <button
                                    onClick={() => handleSave(cmt.comment_id)}
                                    className={cx("btn btn-success py-2 ","btn-text")}
                                >
                                    Lưu
                                </button>
                                <button
                                    onClick={() => setIsEdit(null)}
                                    className={cx("btn btn-secondary mx-3 py-2 ","btn-text")}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={cx("text-content")} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cmt.content) }}/>                      
                            <div className={cx("d-flex align-items-start mt-3")}>
                                {cmt.userId === userId && (
                                    <>
                                        <div>
                                            <span
                                                onClick={() => handleEdit(cmt.comment_id, cmt.content)}
                                                className={cx("text-primary text-decoration-underline", "fix_content",'cursor-pointer')}
                                            >
                                                Sửa
                                            </span>
                                            <span
                                                disabled={isDeleting}
                                                onClick={() => deleteComment(cmt.comment_id)}
                                                className={cx("text-danger text-decoration-underline mx-4", "fix_content",'cursor-pointer')}
                                            >
                                                Xóa
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className={cx("d-flex justify-content-end w-100")}>
                                    <small className={cx("text-secondary", "fix_content")}>{cmt.created_at}</small>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        ))
    ) : (
        <div>Hãy là người bình luận đầu tiên</div>
    )}
</div>

        </Container>
    );
}

export default Comment;
