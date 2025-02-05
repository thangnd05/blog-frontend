import classNames from "classnames/bind";
import style from "./post.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card,Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import routes from "~/config";
import images from "~/assets/images";

const cx = classNames.bind(style);

function PostItem() {
  const [posts, setPosts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
  };


  useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:8080/api/postApprove");
            const postsData = response.data;
      
            const postsWithDetails = await Promise.all(
              postsData.map(async (post) => {
                let username = "Anonymous";
                let categoryName ="";
                let images = [];
                
                try {
                  const categoryResponse = await axios.get(
                    `http://localhost:8080/api/category/${post.categoryId}`
                  );
                  categoryName = categoryResponse.data.categoryName ;
                } catch (err) {
                }
      
      
                try {
                  const userResponse = await axios.get(
                    `http://localhost:8080/api/user/${post.userId}`
                  );
                  username = userResponse.data.username || "Anonymous";
                } catch (err) {
                }
      
                try {
                  const imagesResponse = await axios.get(
                    `http://localhost:8080/api/image/post/${post.post_id}`
                  );
                  images = imagesResponse.data || [] || null;
                } catch (err) {
                  if (err.response?.status !== 404) {
                    images = null;  
                  }
                }
      
                return { ...post, username,categoryName, images };
              })
            );
      
            setPosts(postsWithDetails);
          } catch (err) {
            // console.error(err);
          }
        };
      
        fetchData();
      }, []);

      const groupCategory = posts.reduce((group, name) => {
        const { categoryName } = name;//lấy categoryname theo bài viết hiện tại
        if (!group[categoryName]) {
            group[categoryName] = [];//nếu chưa có danh mục thì tạo 1 mảng mới
        }
        group[categoryName].push(name); //thêm bài viết vào danh mục tương ứng
        return group; //trả về group đã cập nhật
    }, {}); //khởi tạo group là 1 object rỗng

  
    return (
      <div className={cx('post-item')}>
        {Object.keys(groupCategory).map((categoryName) => (
          <div key={categoryName}>
            <h1 className={cx('title', 'mt-5', 'py-5')}>Bài viết về {categoryName}</h1>
            <Row className="g-4">
              {groupCategory[categoryName]
              //.slice(start, end): Phương thức này trả về một phần của mảng từ vị trí start đến 
              //nếu showAll là true, thì lấy toàn bộ danh sách bài viết (groupCategory[categoryName].length).
              //Nếu showAll là false, chỉ lấy tối đa 8 phần tử đầu tiên
                .slice(0, showAll ? groupCategory[categoryName].length : 8)
                .map((post) => (
                  <Col key={post.post_id} xl={3} lg={4} md={6} sm={12}>                                    
                   {/* chia ảnh theo kích thước màn hình */}                
                    <Card
                      as={Link}
                      to={routes.postDetail.replace(':id', post.post_id)}
                      className={cx('custom-card')}
                    >
                      {post.images && post.images.length > 0 ? (
                        <Card.Img
                          className={cx('img-content')}
                          src={`http://localhost:8080/api/image/post/${post.post_id}`}
                          alt={post.title}
                        />
                      ) 
                      : (
                        <Card.Img
                          className={cx('img-content')}
                          src={images.defaultImage}
                          alt={post.title}
                        />
                      )}
  
                      <Card.Body>
                        <Card.Title className={cx('title-content')}>{post.title}</Card.Title>
                        <div className={cx('d-flex', 'justify-content-between')}>
                          <Card.Text className={cx('text-secondary')}>{post.username}</Card.Text>
                          <Card.Text className={cx('text-secondary')}>{post.created_at}</Card.Text>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
  
            {/* Hiển thị nút "Xem tất cả" nếu có hơn 8 bài viết */}
            {groupCategory[categoryName].length > 8 && (
              <Button
                variant="link"
                onClick={handleToggle}
                className={cx('showAll-btn')}
              >
                {showAll ? 'Ẩn' : 'Xem tất cả'}
              </Button>
            )}
          </div>
        ))}
      </div>
    );
}

export default PostItem;
