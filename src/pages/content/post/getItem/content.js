import classNames from "classnames/bind";
import style from "./post.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import routes from "~/config";

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
            let categoryName = "";
            let url = "";

            try {
              const categoryResponse = await axios.get(
                `http://localhost:8080/api/category/${post.categoryId}`
              );
              categoryName = categoryResponse.data.categoryName || "";
            } catch (err) {}

            try {
              const userResponse = await axios.get(
                `http://localhost:8080/api/user/${post.userId}`
              );
              username = userResponse.data.username || "Anonymous";
            } catch (err) {}

            try {
              const imageResponse = await axios.get(
                `http://localhost:8080/api/image/post/${post.post_id}`
              );
              url = imageResponse.data.url || "";
            } catch (err) {
              console.error("Error fetching image:", err);
            }

            return { ...post, username, categoryName, url };
          })
        );

        setPosts(postsWithDetails);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchData();
  }, []);

  const groupCategory = posts.reduce((group, post) => {
    const { categoryName } = post;
    group[categoryName] = group[categoryName] || [];
    group[categoryName].push(post);
    return group;
  }, {});

  return (
    <div className={cx("post-item")}>
      {Object.keys(groupCategory).map((categoryName) => (
        <div key={categoryName}>
          <h1 className={cx("title", "mt-5", "py-5")}>{categoryName}</h1>
          <Row className="g-4">
            {groupCategory[categoryName]
              .slice(0, showAll ? groupCategory[categoryName].length : 8)
              .map((post) => (
                <Col key={post.post_id} xl={3} lg={4} md={6} sm={12}>
                  <Card
                    as={Link}
                    to={routes.postDetail.replace(":id", post.post_id)}
                    className={cx("custom-card")}
                  >
                    <Card.Img
                      className={cx("img-content")}
                      src={post.url}
                      alt={post.title}
                    />
                    <Card.Body>
                      <div className={cx("title-container")}>
                          <Card.Title className={cx("title-content")}>{post.title}</Card.Title>
                          {post.checkMembership && (
                            <span className={cx("badge", "bg-info", "vip-badge")}>VIP</span>
                          )}
                        </div>
                        
                      <div className={cx("d-flex", "justify-content-between")}>
                        <Card.Text className={cx("text-secondary")}>
                          {post.username}
                        </Card.Text>
                        <Card.Text className={cx("text-secondary")}>
                          {post.created_at}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
          {groupCategory[categoryName].length > 8 && (
            <Button
              variant="link"
              onClick={handleToggle}
              className={cx("showAll-btn")}
            >
              {showAll ? "Ẩn" : "Xem tất cả"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostItem;