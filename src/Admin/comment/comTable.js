import axios from 'axios';
// import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames/bind';
import style from './../user/user.module.scss';
import { Link } from 'react-router-dom';
import routes from '~/config';
import DOMPurify from 'dompurify';


const cx = classNames.bind(style);

function ComTable() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);


    const handleDelete=(commentId)=>{
        if(window.confirm('Xóa bình luận này')){
            setIsDeleting(true);
            axios.delete(`http://localhost:8080/api/comment/${commentId}`)
            .then(()=>{
                setData(data.filter((com) => com.comment_id !== commentId))
                alert("Bình luận đã được xóa ");
            })
            .catch((error)=>{
                alert("Không thể xóa bình luận này. Vui lòng thử lại.");
            }).finally(() => {
                setIsDeleting(false); 
            });
        }

    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:8080/api/comment");
            const postsData = response.data;
      
            const CommentWithDetail = await Promise.all(
              postsData.map(async (com) => {
                let username = "Anonymous";
                let title =""
                    
                try {
                  const userResponse = await axios.get(
                    `http://localhost:8080/api/user/${com.userId}`
                  );
                  username = userResponse.data.username || "Anonymous";
                } catch (err) {
                  console.error("Error fetching user data:", err);
                }

                try {
                    const postResponse = await axios.get(
                      `http://localhost:8080/api/posts/${com.postId}`
                    );
                    title = postResponse.data.title || "Anonymous";
                  } catch (err) {
                    console.error("Error fetching user data:", err);
                  }
      
                
                return { ...com, title,username };
              })
            );
      
            setData(CommentWithDetail);
          } catch (err) {
            console.error(err);
          }
        };
      
        fetchData();
      }, []);
    
    
    
    const groupedComments = data.reduce((group, comment) => {
        const { title } = comment;
        if (!group[title]) {
            group[title] = [];
        }
        group[title].push(comment);
        return group;
    }, {});

    return (
        <div>
            <Form>
                <InputGroup>
                    <Form.Control
                        className={cx('search-user')}
                        placeholder="Tìm kiếm theo nội dung bình luận:"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </Form>

            {/* Lặp qua từng nhóm bài viết */}
            {/* {Object.keys(groupedComments).map((title) => (
                <div key={title} className={cx('mt-4')}>
                    <h3 style={{fontWeight:700}} >Bài viết : {title}</h3>
                    <Table striped bordered hover style={{marginTop:"10px"}}>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Tác giả</th>
                                <th>Nội dung bình luận</th>
                                <th>Ngày bình luận</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedComments[title]
                            .filter((com)=>{
                                return search.toLowerCase() ==='' ? true : // Nếu không có từ khóa tìm kiếm, sẽ hiển thị tất cả
                                com.content.includes(search); // Kiểm tra nếu tên người dùng chứa chuỗi tìm kiếm (phân biệt chữ hoa chữ thường)
                                })
                                                       
                            .map((com) => (
                                <tr key={com.comment_id}>
                                    <td>{com.comment_id}</td>
                                    <td>{com.username}</td>
                                    <td>{com.content}</td>
                                    <td>{com.created_at}</td>
                                    <td>
                                        {/* <Link to={`/updateComment/${com.comment_id}`}> */}
                                        {/* <Link to={routes.updateComment.replace(':commentId',com.comment_id)}>
                                            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                                        </Link>
                                        <button className={cx("mx-3")} onClick={()=>handleDelete(com.comment_id)} disabled={isDeleting}>
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table> */}
                {/* </div>
            ))} */} *
            <div className="">
  {Object.keys(groupedComments).map((title) => (
    <div key={title} className={cx('mt-4')}>
      <h3 style={{ fontWeight: 700 }}>Bài viết: {title}</h3>
      {groupedComments[title]
        .filter((com) => {
          return search.toLowerCase() === ''
            ? true
            : com.content.toLowerCase().includes(search.toLowerCase());
        })
        .map((com) => (
          <div
            key={com.comment_id}
            className="border rounded p-3 mb-3 shadow-sm bg-white"
          >
            <p>
              <strong>ID:</strong> {com.comment_id}
            </p>
            <p>
              <strong>Tác giả:</strong> {com.username}
            </p>
            <p className={cx("content")}>
                          <strong>Nội dung:</strong>{" "}
                          <span
                            className={cx('content-wrap')}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(com.content),
                            }}
                          />
                        </p>
            <p>
              <strong>Ngày bình luận:</strong> {com.created_at}
            </p>
            <div className="d-flex  align-items-center">
              <Link to={routes.updateComment.replace(':commentId', com.comment_id)}>
                <FontAwesomeIcon icon={faPen} />
              </Link>
              <button
                onClick={() => handleDelete(com.comment_id)}
                disabled={isDeleting}
                className={cx('mx-3')}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
    </div>
  ))}
</div>

        </div>
    );
}

export default ComTable;
