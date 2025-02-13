import { Nav,Container,Navbar,Button,Dropdown,Image,Offcanvas} from 'react-bootstrap';
import React, { useEffect, useState } from "react"; 
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from "./header.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/images';
import classNames from "classnames/bind";
import Search from '../Search';
import { UserContext } from '~/pages/user/IsLogin';
import { useContext } from 'react';
import routes from '~/config';
import axios from 'axios';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { name } from '~/assets/images';
const cx=classNames.bind(style)

function Header() {
  const { user, logout } = useContext(UserContext); // Lấy thông tin người dùng từ context
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  useEffect(() => {
  if (user && user.email) { // Kiểm tra xem 'value' và 'value.email' có hợp lệ không
            axios
                .get(`http://192.168.100.205:8080/api/mail/${user.email}`)
                .then((res) => {
                    setData(res.data);
                })
                .catch((error) => {
                    // console.log(error);
                })
                .finally(() => {
                    setLoading(false); // Dừng trạng thái loading sau khi hoàn tất API call
                });
        } else {
            // console.log('Không có email trong localStorage');
            setLoading(false); // Dừng trạng thái loading nếu email không tồn tại
        }
    }, [user]); // Chạy 1 lần khi component mount

  if (loading) {
      return <h1>Đang kiểm tra quyền truy cập...</h1>; // Hiển thị trạng thái loading
  }
  

  
  return (
    <div className={cx("wrapper")}>
      <Navbar expand="lg" className={cx("bg-body-tertiary p-5")}>
        <Container fluid="lg">
          {/* Brand */}
          <Navbar.Brand as={Link} to={routes.home} className={cx("brand","fw-bold")}>
            {name}
          </Navbar.Brand>
  
          {/* Nút Offcanvas (hiện trên màn hình nhỏ) */}
          <Button
            variant="outline-secondary"
            onClick={handleShow}
            className={cx("d-lg-none", "ms-auto",'bar')}
            aria-controls='basic-navbar-nav'
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
  
          {/* Navbar đầy đủ (hiện trên màn hình lớn) */}
          <Navbar.Collapse id="basic-navbar-nav" className={cx("d-none d-lg-flex")}>
            <Nav className={cx("me-auto")}>
              <Nav.Link as={Link} to={routes.content} className={cx("mx-5", "home")}>
                Bài viết
              </Nav.Link>
              <Nav.Link as={Link} to={routes.about} className={cx("mx-2", "home")}>
                Giới thiệu
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Collapse id="basic-navbar-nav" className={cx("d-none d-lg-flex")}>
            <Nav>
              <Search />
            </Nav>
            <Nav>
          {user ? (
            <>
                <Nav className={cx("me-auto")}>
                  <Nav.Link as={Link} to={routes.post} className={cx("mx-5")}>
                    <Button variant="btn btn-outline-secondary" className={cx("new-post")}>
                      Tạo bài viết
                    </Button>
                  </Nav.Link>
                </Nav>
            </>
          ) : (
            null // hoặc hiển thị một nội dung khác nếu cần
          )}
        </Nav>           
          </Navbar.Collapse>

          <Navbar.Collapse id="basic-navbar-nav" className={cx("d-none d-lg-flex")}>
            <Nav>
              {user ? (               
                <Dropdown>               
                  <Dropdown.Toggle as="div" className={cx("user-info")}>
                    <Image
                      src={images.avtImage}
                      alt="Avatar"
                      className={cx("avatar")}
                    />
                    <div>
                    <span className={cx("username")}>{data?.username}</span>
                    </div>
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu className={cx("custom-dropdown")}>
                    <Dropdown.Item  as={Link} to={routes.profile} className={cx("my-2","home_sm","custom-dropdown-item")}>Hồ sơ</Dropdown.Item>
                    <Dropdown.Item  onClick={logout} as={Link } to={routes.home} className={cx("my-2","home_sm","custom-dropdown-item")}>Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to={routes.login} className={cx("mx-5","home")}>
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link as={Link} to={routes.register} className={cx("mx-5","home")}>
                    Đăng ký
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>

  
          {/* Offcanvas (hiện trên màn hình nhỏ) */}
          <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" >
            <Offcanvas.Header closeButton className={cx("w-100")} >
              <Offcanvas.Title as={Link} to={routes.home} onClick={handleClose} className={cx("my-2","tit_sm")} >EDT</Offcanvas.Title>
              <Nav className={cx("w-100")}>
          {user ? (
            <>
                <Nav>
                  <Nav.Link as={Link} to={routes.post} className={cx("me-auto d-flex justify-content-center w-100")}>
                    <Button variant="btn btn-outline-secondary" className={cx("new-post")} onClick={handleClose}  >
                      Tạo bài viết
                    </Button>
                  </Nav.Link>
                </Nav>
            </>
          ) : (
            null // hoặc hiển thị một nội dung khác nếu cần
          )}
        </Nav> 
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column" onClick={handleClose}>
                <Nav.Link as={Link} to={routes.content} className={cx("my-2","home_sm")} onClick={handleClose} >Bài viết</Nav.Link>
                <Nav.Link as={Link} to={routes.about} className={cx("my-2","home_sm")} onClick={handleClose}>Giới thiệu</Nav.Link>
              </Nav>
              <Nav className="mt-3" >
                <Search onClick={handleClose} />
              </Nav>
              <Nav className="mt-3">
                <Nav>
              {user ? (               
                <Dropdown>               
                  <Dropdown.Toggle as="div" className={cx("user-info","my-2")}>
                    <Image
                      src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg"
                      alt="Avatar"
                      className={cx("avatar")}
                    />
                    <div>
                    <span className={cx("username")}>{data?.username}</span>
                    </div>
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu className={cx("custom-dropdown")}>
                    <Dropdown.Item  as={Link} to={routes.userPost} className={cx("my-2","home_sm","custom-dropdown-item")} onClick={handleClose} >Hồ sơ</Dropdown.Item>
                    <Dropdown.Item  onClick={()=>{logout();handleClose()}} as={Link } to={routes.home} className={cx("my-2","home_sm","custom-dropdown-item")} >Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                <div className={cx("d-flex justify-content-between align-items-end ")}>
                  <Nav.Link as={Link} to={routes.login} onClick={handleClose} className={cx("home_sm")}>
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link as={Link} to={routes.register} onClick={handleClose} className={cx("home_sm")}>
                    Đăng ký
                  </Nav.Link>
                </div>
                </>
              )}
            </Nav>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}  

export default Header;