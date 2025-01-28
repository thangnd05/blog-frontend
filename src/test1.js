// import { Nav,Container,Navbar,Button,Dropdown,Image} from 'react-bootstrap';
// import React, { useEffect, useState } from "react"; 
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import style from "./header.module.scss"

// import classNames from "classnames/bind";
// import Search from '../Search';
// import { UserContext } from '~/pages/user/IsLogin';
// import { useContext } from 'react';
// import routes from '~/config';
// import axios from 'axios';

// const cx=classNames.bind(style)

// function Header() {
//   const { user, logout } = useContext(UserContext); // Lấy thông tin người dùng từ context
  

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true); // Thêm trạng thái loading

//   useEffect(() => {
//   if (user && user.email) { // Kiểm tra xem 'value' và 'value.email' có hợp lệ không
//             axios
//                 .get(`http://localhost:8080/api/mail/${user.email}`)
//                 .then((res) => {
//                     setData(res.data);
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 })
//                 .finally(() => {
//                     setLoading(false); // Dừng trạng thái loading sau khi hoàn tất API call
//                 });
//         } else {
//             console.log('Không có email trong localStorage');
//             setLoading(false); // Dừng trạng thái loading nếu email không tồn tại
//         }
//     }, [user]); // Chạy 1 lần khi component mount

//   if (loading) {
//       return <h1>Đang kiểm tra quyền truy cập...</h1>; // Hiển thị trạng thái loading
//   }
  

  
//  return (
//   <div className={cx('wrapper')}>
//     <Navbar expand="lg" className={cx("bg-body-tertiary p-5")}>
//       <Container>
//         <Navbar.Brand as={Link} to={routes.home} className={cx("brand")} > EDT Blog</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className={cx("me-auto")}>
//             <Nav.Link as={Link} to={routes.content} className={cx("mx-5",'home')}>Bài viết</Nav.Link>
//             {/* <Nav.Link as={Link} to="/theloai"  className={cx("mx-5",'home')}>Thể loại</Nav.Link> */}
//             <Nav.Link as={Link} to={routes.about}  className={cx("mx-5",'home')}>Giới thiệu</Nav.Link> 
//           </Nav>
//         </Navbar.Collapse>


//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav>
//             <Search/>             
//           </Nav>  

        //   <Nav>
        //   {user ? (
        //     <>
        //         <Nav className={cx("me-auto")}>
        //           <Nav.Link as={Link} to={routes.post}className={cx("mx-5")}>
        //             <Button variant="btn btn-outline-secondary" className={cx("new-post")}>
        //               Tạo bài viết
        //             </Button>
        //           </Nav.Link>
        //         </Nav>
        //     </>
        //   ) : (
        //     null // hoặc hiển thị một nội dung khác nếu cần
        //   )}
        // </Nav>            
//         </Navbar.Collapse>

        
//           <Navbar.Collapse id="basic-navbar-nav">
            // <Nav>
            //   {user ? (               
            //     <Dropdown>               
            //       <Dropdown.Toggle as="div" className={cx("user-info")}>
            //         <Image
            //           src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg"
            //           alt="Avatar"
            //           className={cx("avatar")}
            //         />
            //         <div>
            //         <span className={cx("username")}>{data?.username}</span>
            //         </div>
            //       </Dropdown.Toggle>
                  
            //       <Dropdown.Menu className={cx("custom-dropdown")}>
            //         <Dropdown.Item  as={Link} to={routes.userPost}>Hồ sơ</Dropdown.Item>
            //         <Dropdown.Item  onClick={logout} as={Link } to={routes.home}>Đăng xuất</Dropdown.Item>
            //       </Dropdown.Menu>
            //     </Dropdown>
            //   ) : (
            //     <>
            //       <Nav.Link as={Link} to={routes.login}className={cx("mx-5")}>
            //         Đăng nhập
            //       </Nav.Link>
            //       <Nav.Link as={Link} to={routes.register} className={cx("mx-5")}>
            //         Đăng ký
            //       </Nav.Link>
            //     </>
            //   )}
            // </Nav>
//           </Navbar.Collapse>



//       </Container>
//     </Navbar>
//   </div>
//       );
//     }
    

// export default Header;