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
  const fetchData = async () => {
    if (searchValue) {
      try {
        const response = await axios.get(`http://localhost:8080/api/search?title=${searchValue}`);
        const postsData = response.data;

        const postsWithDetails = await Promise.all(
          postsData.map(async (post) => {
            let username = "Anonymous";
            let categoryName = "";
            let url = "";

              // Fetch category data
              try {
                const categoryResponse = await axios.get(
                  `http://localhost:8080/api/category/${post.categoryId}`
                );
                categoryName = categoryResponse.data.categoryName || "";
              } catch (err) {
                console.error("Error fetching category:", err);
              }

              // Fetch user data
              try {
                const userResponse = await axios.get(
                  `http://localhost:8080/api/user/${post.userId}`
                );
                username = userResponse.data.username || "Anonymous";
              } catch (err) {
                console.error("Error fetching user:", err);
              }

              // Fetch image data
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

        setData(postsWithDetails);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    } 
  };

  fetchData();
}, [searchValue]);



    return (
        <div className={cx("post-item")}>
            <Row className="g-4">
                {data.map((post) => (
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
                      <Card.Title className={cx("title-content")}>
                        {post.title}
                        {post.checkMembership && (
                          <span className={cx("badge", "bg-info", "mx-2")}>
                            VIP
                          </span>
                        )}
                      </Card.Title>
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
        </div>
    );
}

export default AllSearch;
