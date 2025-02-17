import axios from 'axios';
import { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faPen } from '@fortawesome/free-solid-svg-icons';
import { Form,InputGroup } from 'react-bootstrap';
import classNames from 'classnames/bind';
import style from './user.module.scss'
import { Link } from 'react-router-dom';

const cx=classNames.bind(style)

function UserTable() {
  const [data,setData]=useState([])
  const [isDeleting, setIsDeleting] = useState(false);
  const[search,setSearch]=useState('')

    useEffect(()=>{
      axios.get(`http://localhost:8080/api/user`
      )
    .then((respon)=>{
      setData(respon.data)
    })
    .catch((error) => {
      console.error("Error", error);
  });
    },[])

    const handleDelete = (userId) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        setIsDeleting(true); // Bắt đầu trạng thái đang xóa
        axios
          .delete(`http://localhost:8080/api/user/${userId}`)
          .then(() => {
            // Cập nhật lại danh sách sau khi xóa
            setData(data.filter((user) => user.user_id !== userId));
            alert("Người dùng đã được xóa thành công.");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            alert("Không thể xóa người dùng. Vui lòng thử lại.");
          })
          .finally(() => {
            setIsDeleting(false); // Kết thúc trạng thái xóa
          });
      }
    };

    return(
      <div>
        <Form>
        <InputGroup >
            <Form.Control 
            className={cx('search-user')} 
            placeholder="Tìm kiếm theo UserName:"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
        </InputGroup>

        </Form>  

        <div className="w-100" style={{ overflowX: "auto" }}>
  {/* Responsive dạng stacked cho màn hình nhỏ */}
  <div>
    {data
      .filter((user) => {
        return search.toLowerCase() === ""
          ? true
          : user.username.toLowerCase().includes(search.toLowerCase());
      })
      .map((user) => (
        <div
          key={user.user_id}
          className="border rounded p-3 mb-3 shadow-sm bg-white"
        >
          <p>
            <strong>ID:</strong> {user.user_id}
          </p>
          <p>
            <strong>Họ và tên:</strong> {user.fullname}
          </p>
          <p>
            <strong>Tên người dùng:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Ngày tạo:</strong> {user.created_at}
          </p>
          <p>
            <strong>Hành động:</strong>
          <div className="d-flex">
            <Link to={`/edit-user/${user.user_id}`}>
              <FontAwesomeIcon icon={faPen} />
            </Link>
            <button
              onClick={() => handleDelete(user.user_id)}
              disabled={isDeleting}
              className={cx("mx-3")}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          </p>

        </div>
      ))}
  </div>
</div>

    </div>   


);
}


export default UserTable;