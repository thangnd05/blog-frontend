import axios from 'axios';
// import Table from 'react-bootstrap/Table';
import { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Form,InputGroup,Button } from 'react-bootstrap';
import classNames from 'classnames/bind';
import style from './../user/user.module.scss'
import { Link } from 'react-router-dom';
import routes from '~/config';
import DOMPurify from 'dompurify';

const cx=classNames.bind(style);

function PostTable() {
  const [data,setData]=useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const[approved,setApproved]=useState(false);
  const [search,setSearch]=useState('');
  

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

  const handleApprove = (postId) => {
    if (window.confirm("Duyệt bài viết này?")) {
      // Cập nhật ngay lập tức trạng thái `approved` trong data
      setData((prevData) =>
        prevData.map((post) =>
          post.post_id === postId ? { ...post, status: 'Approved' } : post
        )
      );
  
      setApproved(true); // Thêm trạng thái đang duyệt, nếu cần
  
      axios
        .put(`http://localhost:8080/admin/approve/${postId}`)
        .then(() => {
          alert("Bài viết đã được duyệt thành công.");
        })
        .catch(() => {
          alert("Không thể duyệt bài viết này. Vui lòng thử lại.");
          // Nếu duyệt thất bại, cần đảo ngược lại trạng thái `approved`
          setData((prevData) =>
            prevData.map((post) =>
              post.post_id === postId ? { ...post, status: 'Pending' } : post
            )
          );
        })
        .finally(() => {
          setApproved(false); // Kết thúc trạng thái duyệt nếu cần
        });
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        const postsData = response.data;
  
        const postsWithDetails = await Promise.all(
          postsData.map(async (post) => {
            let username = "Anonymous";
            let categoryName ="";
            
            try {
              const categoryResponse = await axios.get(
                `http://localhost:8080/api/category/${post.categoryId}`
              );
              categoryName = categoryResponse.data.categoryName ;
            } catch (err) {
              console.error("Error fetching user data:", err);
            }
  
  
            try {
              const userResponse = await axios.get(
                `http://localhost:8080/api/user/${post.userId}`
              );
              username = userResponse.data.username || "Anonymous";
            } catch (err) {
              console.error("Error fetching user data:", err);
            }
  
  
            return { ...post, username,categoryName };
          })
        );
  
        setData(postsWithDetails);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  

    return(    
      <div>
        <Form>
        <InputGroup >
        <Form.Control 
        className={cx('search-user')} 
        placeholder="Tìm kiếm theo tiêu đề:"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
    </InputGroup>

    </Form>  

    <div className="">
  {data
    .filter((post) => {
      return search.toLowerCase() === ''
        ? true
        : post.title.toLowerCase().includes(search.toLowerCase());
    })
    .map((post) => (
      <div
        key={post.post_id}
        className="border rounded p-3 mb-3 shadow-sm bg-white"
      >
        <p>
          <strong>ID:</strong> {post.post_id}
        </p>
        <p>
          <strong>Tiêu đề:</strong> {post.title}
        </p>
        <p>
          <strong>Nội dung:</strong>{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />
        </p>
        <p>
          <strong>Tác giả:</strong> {post.username}
        </p>
        <p>
          <strong>Danh mục:</strong> {post.categoryName}
        </p>
        <p>
          <strong>Ngày tạo:</strong> {post.created_at}
        </p>
        <p>
          <strong>Ngày sửa:</strong> {post.updated_at}
        </p>
        <p>
          <strong>Trạng thái:</strong>{' '}
          {post.status === 'Approved' ? (
            <span className="text-success fw-bold">Đã duyệt</span>
          ) : (
            <>
              <Button
                variant="btn btn-outline-dark"
                onClick={() => handleApprove(post.post_id)}
                disabled={post.approved || approved}
              >
                <FontAwesomeIcon icon={faCheck} />
              </Button>
              <Button
                variant="btn btn-outline-dark"
                className="mx-3"
                onClick={() => handleDelete(post.post_id)}
                disabled={isDeleting}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </>
          )}
        </p>
        <div className="d-flex ">
          <Link to={routes.updatePost.replace(':postId', post.post_id)}>
            <FontAwesomeIcon icon={faPen} />
          </Link>
          <button
            onClick={() => handleDelete(post.post_id)}
            disabled={isDeleting}
            className="mx-3"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    ))}
</div>

      </div> 

     




    
    
  );
}


export default PostTable;