import axios from 'axios';
import { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Form,InputGroup } from 'react-bootstrap';
import classNames from 'classnames/bind';
import style from './user.module.scss'
import { Link } from 'react-router-dom';
import routes from '~/config';
import DOMPurify from 'dompurify';
import { fetchUserId } from '~/hook/service';


const cx=classNames.bind(style);

function PostTabeProFile() {
  const [data,setData]=useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search,setSearch]=useState('');
  const [userId,setUserId]=useState(" ")
  


  useEffect(() => {
          fetchUserId(setUserId); // Gọi hàm và truyền `setUserId`
      }, []);  
  
  
  
  const handleDelete = (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setIsDeleting(true); // Bắt đầu trạng thái đang xóa
      axios
        .delete(`http://localhost:8080/api/posts/${postId}`)
        .then(() => {
          // Cập nhật lại danh sách sau khi xóa
          setData(data.filter((post) => post.post_id !== postId));
          alert("bài viết này đã được xóa thành công.");
        })
        .catch((error) => {
          
          alert("Không thể xóa bài viết này. Vui lòng thử lại.");
        })
        .finally(() => {
          setIsDeleting(false); // Kết thúc trạng thái xóa
        });
    }
  };
  
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      
      try {
        if (!userId) {
          console.log("userId không hợp lệ:", userId);
          return;
        }
        
        const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
        const postsData = response.data;

        const postsWithDetails = await Promise.all(
          postsData.map(async (post) => {
            let username = "Anonymous";
            let categoryName = "";

            try {
              const categoryResponse = await axios.get(`http://localhost:8080/api/category/${post.categoryId}`);
              categoryName = categoryResponse.data.categoryName;
            } catch (err) {
              // console.error("Error fetching category data:", err);
              if(err.status===404){

              }
            }

            try {
              const userResponse = await axios.get(`http://localhost:8080/api/user/${post.userId}`);
              username = userResponse.data.username || "Anonymous";
            } catch (err) {
              // console.error("Error fetching user data:", err);
            }

            return { ...post, username, categoryName };
          })
        );

        setData(postsWithDetails);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userId]);

    return(    
      <div>
      <Form>
        <InputGroup>
          <Form.Control
            className={cx("search-user")}
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Form>
    
      {/* Vùng hiển thị bảng */}
      <div className="w-100" style={{ overflowX: "auto" }}>
        {/* Responsive cho màn hình lớn */}
        {/* <div className="d-none d-lg-block">
          <Table striped bordered hover className={cx("mt-5")}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th style={{ maxWidth: "450px" }}>Nội dung</th>
                <th>Danh mục</th>
                <th>Ngày tạo</th>
                <th>Ngày sửa</th>
                <th>Hành động</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((post) => {
                  return search.toLowerCase() === ""
                    ? true
                    : post.title.toLowerCase().includes(search.toLowerCase());
                })
                .map((post) => (
                  <tr key={post.post_id}>
                    <td data-label="Tiêu đề">{post.title}</td>
                    <td
                      data-label="Nội dung"
                      style={{ maxWidth: "600px" }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content),
                      }}
                    />
                    <td data-label="Danh mục">{post.categoryName}</td>
                    <td data-label="Ngày tạo">{post.created_at}</td>
                    <td data-label="Ngày sửa">{post.updated_at}</td>
                    <td data-label="Hành động">
                      <Link
                        to={routes.updatePost.replace(":postId", post.post_id)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.post_id)}
                        disabled={isDeleting}
                        className={cx("mx-3")}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                    <td
                      data-label="Trạng thái"
                      className={cx({
                        "text-success fw-bold": post.status === "Approved",
                        "text-danger fw-bold": post.status !== "Approved",
                      })}
                    >
                      {post.status === "Approved" ? "Đã duyệt" : "Chờ duyệt"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div> */}
        {/* Responsive cho màn hình nhỏ */}
        <div className="">
          {data
            .filter((post) => {
              return search.toLowerCase() === ""
                ? true
                : post.title.toLowerCase().includes(search.toLowerCase());
            })
            .map((post) => (
              <div
                key={post.post_id}
                className="border rounded p-3 mb-3 shadow-sm bg-white"
              >
                <p>
                  <strong>Tiêu đề:</strong> {post.title}
                </p>
                <p className={cx("content")}>
                  <strong>Nội dung:</strong>{" "}
                  <span
                    className={cx('content')}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />
                </p>
                <p>
                  <strong>Danh mục:</strong> {post.categoryName}
                </p>
                <p >
                  <strong>Ngày tạo:</strong> {post.created_at}
                </p>
                <p>
                  <strong>Ngày sửa:</strong> {post.updated_at}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={cx({
                      "text-success fw-bold": post.status === "Approved",
                      "text-danger fw-bold": post.status !== "Approved",
                    })}
                  >
                    {post.status === "Approved" ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
                </p>
                <strong>Hành dộng:</strong>{" "}
                <div className="d-flex ">
                  <Link to={routes.updatePost.replace(":postId", post.post_id)}>
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.post_id)}
                    disabled={isDeleting}
                    className={cx("mx-3")}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    

     




    
    
  );
}


export default PostTabeProFile;