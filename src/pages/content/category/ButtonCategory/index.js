import axios from "axios";
import { useEffect, useState } from "react";
import { Container,Col,Row,Card} from "react-bootstrap";
import { useParams ,Link} from "react-router-dom";
import routes from "~/config";
import classNames from "classnames/bind";
import style from "./cateDel.module.scss"
import images from "~/assets/images";

const cx=classNames.bind(style);

function CategoryDetails() {

    const [data,setData]=useState([]);
    const [categories, setCategories] = useState([]); 
    const { categoryId } = useParams(); // Lấy categoryName từ URL


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/category/${categoryId}`);
      const postsData = response.data;

      const postsWithDetails = await Promise.all(
        postsData.map(async (post) => {
          let username = "Anonymous";
          let images = "";

            try {
              const userResponse = await axios.get(`http://localhost:8080/api/user/${post.userId}`);
              username = userResponse.data.username || "Anonymous";
            } catch (err) {}

            try {
              const imagesResponse = await axios.get(`http://localhost:8080/api/image/post/${post.post_id}`);
              images = imagesResponse.data.url;
            } catch (err) {
              if (err.response?.status !== 404) {
                images = null;
              }
          }
          return { ...post, username, images };
        })
      );

      setData(postsWithDetails);
    } catch (err) {
      // console.error("Error fetching category data:", err);
    }
  };

  fetchData();
}, [categoryId]);


    useEffect(()=>{
      axios.get(
        `http://localhost:8080/api/category/${categoryId}`
      ).then((res)=>{
        setCategories(res.data)
        // console.log(res.data)
      })
    },[categoryId])
   
    return (
      <div className={cx("p-5")}>
        <Container>
          <Link className={cx("btn-return")} as={Link} to={routes.home} >Trở lại</Link>
          <h1 className={cx("title-cate",)}>
              {categories.categoryName}
          </h1>
            <Row className="g-4">
                {/* Kiểm tra nếu có dữ liệu bài viết */}
                {data.length > 0 ? (
                    data.map((post) => (
                       <Col key={post.post_id} xl={3} lg={4} md={6} sm={12}>
                  <Card
                    as={Link}
                    to={routes.postDetail.replace(":id", post.post_id)}
                    className={cx("custom-card")}
                  >
                    <Card.Img
                      className={cx("img-content")}
                      src={post.images}
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
                    ))
                ) : (
                    <p>Không có bài viết hãy là người tạo bài viết đầu tiên.</p>
                )}
            </Row>
        </Container>
      </div>


    );
}

export default CategoryDetails;