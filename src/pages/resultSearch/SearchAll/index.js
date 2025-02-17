import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./AllSearch.module.scss";
import { Link } from "react-router-dom";
import routes from "~/config";

const cx = classNames.bind(style);

function AllSearch() {
    const { searchValue } = useParams();  // Lấy giá trị search từ URL
    const [data, setData] = useState([]);

    useEffect(() => {
        if (searchValue) {
            axios.get(`http://localhost:8080/api/search?title=${searchValue}`)
            .then(async (response) => {
                const postTitle = response.data;
          
                // Lấy thêm thông tin chi tiết cho mỗi bài đăng
                const postsWithDetails = await Promise.all(
                  postTitle.map(async (post) => {
                    let postId=post.post_id;
                    let username = "Anonymous";
                    let images = [];
          
                    // Bước 2: Lấy thông tin bài đăng từ postId
                    try {
                      const postResponse = await axios.get(
                        `http://localhost:8080/api/posts/${postId}`
                      );
                      const postData = postResponse.data;
                      // console.log(postData)
                      
                      // Bước 3: Lấy thông tin user từ userId trong post
                      try {
                        const userResponse = await axios.get(
                          `http://localhost:8080/api/user/${postData.userId}`
    
                        );
                        username = userResponse.data.username || "Anonymous";
                       
                        
    
                      } catch (error) {
                        console.error("Error fetching user data:", error);
                      }
    
          
                      // Bước 4: Lấy ảnh của bài đăng
                      try {
                        const imagesResponse = await axios.get(
                          `http://localhost:8080/api/image/post/${postId}`
                        );
                        images = imagesResponse.data || [];
                      } catch (error) {
                        console.error("Error fetching image data:", error);
                      }
          
                      // Trả về bài đăng với tất cả thông tin
                      return {
                        ...postData,
                        username,
                        images,
                      };
                    } catch (error) {
                      return { ...post, username, images }; // Nếu có lỗi, trả về thông tin mặc định
                    }
                  })
                );
          
                setData(postsWithDetails); // Cập nhật dữ liệu vào state
              })
              .catch((error) => {
                console.error("Error fetching category data:", error);
              });
        } else {
            setData([]);
        }
    }, [searchValue]);



    return (
        <div className={cx("post-item")}>
            <Row className="g-4">
                {data.map((post) => (
                    <Col key={post.post_id} xl={3} lg={4} md={6} sm={12}>
                    <Link to={routes.postDetail.replace(':id', post.post_id)}>
                    <Card className={cx("custom-card")}>
                                {post.images && post.images.length > 0 ? (
                                        <Card.Img
                                            className={cx("img-content")}
                                            src={`http://localhost:8080/api/image/post/${post.post_id}`} 
                                            alt={post.title}
                                        />
                                        ) : (
                                        <Card.Img
                                            className={cx("img-content")}
                                            src="https://media.istockphoto.com/id/1224500457/vi/anh/n%E1%BB%81n-t%E1%BA%A3ng-c%C3%B4ng-ngh%E1%BB%87-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%A3-l%E1%BA%ADp-tr%C3%ACnh-c%E1%BB%A7a-nh%C3%A0-ph%C3%A1t-tri%E1%BB%83n-ph%E1%BA%A7n-m%E1%BB%81m-v%C3%A0-k%E1%BB%8Bch-b%E1%BA%A3n-m%C3%A1y-t%C3%ADnh.jpg?s=612x612&w=0&k=20&c=492Izyb2fyCZfeBOiFxUnxeoMTOH8STWSFa9NJ2WWns="
                                            alt="blog"
                                        />
                                        )}
                                <Card.Body>
                                    <Card.Title className={cx("title-content")}>{post.title}</Card.Title>
                                    <div className={cx("d-flex justify-content-between")}>
                                        <Card.Text className={cx("text-secondary")}>
                                             {post.username}
                                        </Card.Text>
                                        <Card.Text className={cx("text-secondary")}>{post.created_at}</Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default AllSearch;
