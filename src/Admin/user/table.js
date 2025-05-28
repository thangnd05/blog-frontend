import axios from 'axios';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames/bind';
import style from './user.module.scss'

const cx = classNames.bind(style)

function UserTable() {
  const [data, setData] = useState([])
  const [isProcessing, setIsProcessing] = useState(false); // Đổi tên biến cho rõ nghĩa
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:8080/api/user`)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [])

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setIsProcessing(true);
      axios
        .delete(`http://localhost:8080/api/user/${userId}`)
        .then(() => {
          setData(data.filter((user) => user.user_id !== userId));
          alert("Người dùng đã được xóa thành công.");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("Không thể xóa người dùng. Vui lòng thử lại.");
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleMembership = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn duyệt membership cho người dùng này?")) {
      setIsProcessing(true);
      axios
        .put(`http://localhost:8080/api/approveMembership/${userId}`, { membershipId: 2 }) // Giả sử 2 là trạng thái đã duyệt
        .then(() => {
          setData(data.map(user => 
            user.user_id === userId ? { ...user, membershipId: 2 } : user
          ));
          alert("Membership đã được duyệt thành công.");
        })
        .catch((error) => {
          console.error("Error approving membership:", error);
          alert("Không thể duyệt membership. Vui lòng thử lại.");
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  return (
    <div>
      <Form>
        <InputGroup>
          <Form.Control
            className={cx('search-user')}
            placeholder="Tìm kiếm theo UserName:"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Form>

      <div className="w-100" style={{ overflowX: "auto" }}>
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
                <p><strong>ID:</strong> {user.user_id}</p>
                <p><strong>Họ và tên:</strong> {user.fullname}</p>
                <p><strong>Tên người dùng:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Thành viên:</strong> 
                  {user.membershipId === 1 ? 'FREE' : 'VIP'}
                </p>
                <p><strong>Ngày tạo:</strong> {user.created_at}</p>
                <p><strong>Hành động:</strong>
                  <div className="d-flex">
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      disabled={isProcessing}
                      className={cx("mx-3")}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                    {user.membershipId === 1 && (
                      <button
                        onClick={() => handleMembership(user.user_id)}
                        disabled={isProcessing}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
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