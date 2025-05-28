import { useEffect, useState } from "react";
import axios from "axios";

function All() {
    const [post, setPost] = useState([]);
    const [user, setUser] = useState([]);
    const [comment, setComment] = useState([]);


    // Lấy dữ liệu bài viết
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:8080/api/posts');
                setPost(postsResponse.data);
    
                const userResponse = await axios.get('http://localhost:8080/api/user');
                setUser(userResponse.data);
    
                const commentResponse = await axios.get('http://localhost:8080/api/comment');
                setComment(commentResponse.data);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchData();
    }, []);
    

    // Lọc bài viết đã duyệt và chưa duyệt
    const approvedPosts = post.filter((item) => item.status === "Approved");
    const unapprovedPosts = post.filter((item) => item.status === "Pending");

    return (
        <div>
            <div>
                Tổng số bài viết: <strong>{post.length}</strong>
            </div>
            <div>
                Bài viết đã duyệt: <strong>{approvedPosts.length}</strong>
            </div>
            <div>
                Bài viết chưa duyệt: <strong>{unapprovedPosts.length}</strong>
            </div>
            <div className="mt-5">
                Tổng số người dùng: <strong>{user.length}</strong>
            </div>
            <div className="mt-5">
                Tổng số bình luận: <strong>{comment.length}</strong>
            </div>
        </div>
    );
}

export default All;
