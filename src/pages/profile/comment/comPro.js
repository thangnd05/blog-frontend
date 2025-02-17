import axios from "axios";
import { useEffect, useState } from "react";
import { Form,InputGroup} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import style from "../post/user.module.scss"
import {  faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import routes from "~/config";
import { fetchUserId } from "~/hook/service";
import DOMPurify from 'dompurify';



const cx=classNames.bind(style);
function ComProFileTable(){

    const [data,setData]=useState([])
    const [isDeleting, setIsDeleting] = useState(false);
    const [search,setSearch]=useState('');
    const [userId,setUserId]=useState('');



    
//lay du lieu user
     useEffect(() => {
              fetchUserId(setUserId); // Gọi hàm và truyền `setUserId`
          }, []);  

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

    useEffect(()=>{
        if (!userId) {
            // console.log("userId không hợp lệ:", userId);
            return;
          }

        //lay toan bo comment cuar userid
        axios.get(`http://localhost:8080/api/comment/user/${userId}`)
        .then(async(response)=>{
          const postsData=response.data
    
          const commentsUser= await Promise.all(
            postsData.map(async(comment)=>{
              try{
                const userResponse = await axios.get(
                    //goi tu userId de lay thong tin
                  `http://localhost:8080/api/user/${comment.userId}`
                )
                return { ...comment, username: userResponse.data.username };
    
              }catch(error){
                console.log(error);
                return { ...comment, username: "Anonymous" };
              }
            })
          )
          setData(commentsUser)//Cập nhật dữ liệu vào state
        })
      },[userId])

      const groupedComments = data.reduce((group, comment) => {
        const { postId } = comment;
        if (!group[postId]) {
            group[postId] = [];
        }
        group[postId].push(comment);
        return group;
    }, {});



    return(    
        <div className="w-100">
          <Form>
          <InputGroup >
          <Form.Control 
          className={cx('search-user')} 
          placeholder="search"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
      </InputGroup>
  
      </Form>  
  
      {Object.keys(groupedComments).map((postId) => (
  <div key={postId} className={cx('mt-4')}>
    <h5>Bài viết ID: {postId}</h5>
    <div className="">
      {groupedComments[postId]
        .filter((com) => {
          return search.toLowerCase() === ''
            ? true
            : com.content.toLowerCase().includes(search.toLowerCase());
        })
        .map((com) => (
          <div key={com.comment_id} className="border p-3 mb-3 rounded shadow-sm w-100">
            <p className={cx("content")}>
              <strong>Nội dung:</strong>{" "}
              <span
                className={cx('content')}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(com.content),
                }}
              />
            </p>
            <p><strong>Ngày bình luận:</strong> {com.created_at}</p>
            <p><strong>Hành động:</strong></p>
            <div className="d-flex ">
              <Link to={routes.updateComment.replace(':commentId', com.comment_id)}>
                <FontAwesomeIcon icon={faPen} />
              </Link>
              <button
                className={cx('mx-3')}
                onClick={() => handleDelete(com.comment_id)}
                disabled={isDeleting}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
    </div>

    
    {/* <div className="d-none d-lg-block w-50">
  <Table striped bordered hover className="w-100">
    <thead>
      <tr>
        <th className={cx("content-wrap")}>Nội dung</th>
        <th>Ngày bình luận</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {groupedComments[postId]
        .filter((com) => {
          return search.toLowerCase() === ''
            ? true
            : com.content.toLowerCase().includes(search.toLowerCase());
        })
        .map((com) => (
          <tr key={com.comment_id}>
            <td className={cx("content-wrap")}>{com.content}</td>
            <td>{com.created_at}</td>
            <td>
              <Link to={routes.updateComment.replace(':commentId', com.comment_id)}>
                <FontAwesomeIcon icon={faPen} />
              </Link>
              <button
                className={cx('mx-3')}
                onClick={() => handleDelete(com.comment_id)}
                disabled={isDeleting}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </Table>
</div> */}

  </div>
))}




        </div> 
  
       
  
  
  
  
      
      
    );

}

export default ComProFileTable;