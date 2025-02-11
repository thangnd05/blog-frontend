import { useEffect, useState } from "react";
import axios from "axios";
import { Container} from "react-bootstrap";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./getContent.module.scss";
import Comment from "~/Layout/comment";
import DOMPurify from 'dompurify';


const cx = classNames.bind(style);

function GetContent() {
    const [data, setData] = useState(null); // Lưu bài viết và thông tin người dùng
    const { id } = useParams(); // Lấy ID từ URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API lấy bài viết theo ID
                const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`);
                const postData = postResponse.data;

                // Lưu dữ liệu bài viết vào localStorage
                // localStorage.setItem("postData", JSON.stringify(postData));

                // Gọi API lấy thông tin người dùng
                const userResponse = await axios.get(`http://localhost:8080/api/user/${postData.userId}`);
                const enrichedData = {
                    ...postData,
                    user: { username: userResponse.data.username },
                };

                setData(enrichedData); // Cập nhật dữ liệu bài viết
            } catch (err) {
                // console.error(err);
            } 
        };

        fetchData();
    }, [id]);

    
    return (
        <div>
            <Container>
                {data && (
                    <div key={data.post_id}>
                    <div className={cx("w-100 d-flex justify-content-center")}>
                        <div className={cx("title", "d-flex justify-content-center")}>{data.title}</div>
                    </div>

                        {/* dangerouslySetInnerHTML : dung de doc duoc the html do post mang den */}
                        <div className={cx("content", "pt-3")} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}/>
                    
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
                                    <div className={cx("text-secondary")}>
                                    {data.created_at}
                                    </div>
                                </div>
                            </div>                                   
                        </div>
                    </div>
                )}
            </Container>
            <Comment /> {/* Thành phần bình luận */}
        </div>
    );
}

export default GetContent;
