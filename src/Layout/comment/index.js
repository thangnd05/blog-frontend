import { useState, useEffect, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./comment.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchUserId } from "~/hook/service";
import { useParams } from "react-router-dom";


const cx = classNames.bind(style);

function Comment() {
    const [comment, setComment] = useState("");
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEdit,setIsEdit] =useState(false)
    const [newContent, setNewContent] = useState(""); // Nội dung mới của bình luận
    const inputRef =useRef(null)

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
        setNewContent(currentContent); // Gán nội dung hiện tại vào ô nhập
        setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus(); // Focus vào ô nhập
              inputRef.current.setSelectionRange(newContent.length, newContent.length); // Đưa con trỏ đến cuối văn bản
            }
          }, 0); // Đảm bảo focus và setSelectionRange được thực hiện sau khi render
    };
    
    // Hàm lưu bình luận đã sửa
    const handleSave = (commentId) => {
        axios
            .put(`http://localhost:8080/api/comment/${commentId}`, { content: newContent })
            .then(() => {
                // Cập nhật danh sách bình luận
                setData((prevData) =>
                    prevData.map((comment) =>
                        comment.comment_id === commentId ? { ...comment, content: newContent } : comment
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
                <Form.Group>
                    <Form.Label className={cx("title")}>Bình luận</Form.Label>
                    <Form.Control
                        className={cx("comment")}
                        placeholder="Nhập bình luận"
                        value={comment}
                        type="text"
                        onChange={(e) => setComment(e.target.value)}
                        required
                        as="textarea"
                        rows={5}
                    />
                </Form.Group>
                <Button
                    variant="secondary"
                    className={cx("new-comment", "my-4 px-5 text-center")}
                    type="submit"
                >
                    Gửi
                </Button>
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
                            <Form.Group>
                                <Form.Control
                                className={cx("comment")}
                                placeholder="Nhập bình luận"
                                type="text"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                required
                                as="textarea"
                                rows={4}
                                ref={inputRef}

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
                            <div className={cx("text-content")}>{cmt.content}</div>
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
