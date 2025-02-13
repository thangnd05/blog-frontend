import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { useEffect, useState,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup, Button } from 'react-bootstrap';
import classNames from 'classnames/bind';
import style from './../user/user.module.scss';

const cx = classNames.bind(style);

function TableCategory() {
  const [updateId, setUpdateId] = useState(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const ref=useRef();

  useEffect(() => {
    axios.get("http://192.168.100.205:8080/api/category")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleDelete = (category_id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      setIsDeleting(true);
      axios.delete(`http://192.168.100.205:8080/api/category/${category_id}`)
        .then(() => {
          setData(data.filter((category) => category.category_id !== category_id));
          alert("Danh mục đã được xóa");
        })
        .catch(() => {
          alert("Không thể xóa danh mục này. Vui lòng thử lại.");
        }).finally(() => {
          setIsDeleting(false);
        });
    }
  };

  const handleEdit = (category_id) => {
    setUpdateId(category_id);
    setName(data.find(category => category.category_id === category_id)?.categoryName || '');

    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setUpdateId(null);
    setName('');
  };

  const handleUpdate = () => {
    if (updateId && name) {
      axios.put(`http://192.168.100.205:8080/api/category/${updateId}`, { categoryName: name })
        .then(() => {
          setData(data.map(category => 
            category.category_id === updateId ? { ...category, categoryName: name } : category
          ));
          setUpdateId(null);
          setName('');
          alert("Danh mục đã được cập nhật");
        })
        .catch(() => {
          alert("Không thể cập nhật danh mục này. Vui lòng thử lại.");
        });
    }
  };

  return (
    <div>
      <Form onSubmit={(e) => e.preventDefault()}>
        <InputGroup>
          <Form.Control
            className={cx('search-user')}
            placeholder="Tìm kiếm theo danh mục:"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Form>

      <Table striped bordered hover className={cx('table-category', 'mt-5')}>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>ID</th>
            <th style={{ width: '30%' }}>Danh mục</th>
            <th style={{ width: '30%' }}>Ngày tạo</th>
            <th style={{ width: '30%' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((category) =>
              category.categoryName.toLowerCase().includes(search.toLowerCase())
            )
            .map((category) => (
              category.category_id === updateId ? (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>
                  <td>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={cx('w-100 h-100','input-cate')}
                      ref={ref}
                    />
                  </td>
                  <td>{category.created_at}</td>
                  <td>
                    <Button variant="success" onClick={handleUpdate} className={cx('btn-category')}>Cập nhật</Button>
                    <Button variant="danger" className={cx('mx-3','btn-category')} onClick={handleCancel} >Hủy bỏ</Button>
                  </td>
                </tr>
              ) : (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>
                  <td style={{ maxWidth: '300px' }}>{category.categoryName}</td>
                  <td>{category.created_at}</td>
                  <td>
                    <button onClick={() => handleEdit(category.category_id)}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      disabled={isDeleting}
                      className={cx("mx-3")}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              )
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableCategory;
