import classNames from "classnames/bind";
import style from './login.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { UserContext } from "../IsLogin";
import routes from "~/config";

const cx = classNames.bind(style);

function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const { login } = useContext(UserContext);

    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // const handleLogin = (e) => {
    //     e.preventDefault(); // Ngăn reload trang

    //     setIsLoading(true); // Start loading

    //     axios.post("http://localhost:8080/api/login", {
    //         username: username,
    //         password: password
    //     })
    //     .then((response) => {
    //         const userData = response.data;
    //         login({
    //             username: userData.username,
    //             avatar: userData.avatar,
    //         });

    //         // Fetch email
    //         axios.get(`http://localhost:8080/api/username/email?username=${username}`)
    //             .then((emailResponse) => {
    //                 const email =emailResponse.data
    //                 setEmail(email);
    //                 // console.log("Email:", email);
    //                 localStorage.setItem("user", JSON.stringify({
    //                     email:email
    //                 }));
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching email:", error);
    //             });

    //         // Check user role
    //         axios.get(`http://localhost:8080/api/role/${username}`)
    //         .then((roleResponse) => {
    //             const userRole = roleResponse.data;
    //             // console.log(userRole)

    //             if (userRole === "ADMIN") {
    //                 navigate('/admin');
    //             } else if (userRole === "USER") {
    //                 navigate('/');
    //             } else {
    //                 setMessage("Role không hợp lệ.");
    //                 setMessageType("error");
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Lỗi khi kiểm tra quyền người dùng:", error);
    //             setMessage("Lỗi khi kiểm tra quyền người dùng.");
    //             setMessageType("error");
    //         });

    //     })
    //     .catch((error) => {
    //         console.error("Lỗi đăng nhập:", error);
    //         setMessage("Tài khoản hoặc mật khẩu không đúng.");
    //         setMessageType("error");
    //         setPassWord('');
    //     })
    //     .finally(() => {
    //         setIsLoading(false); // End loading
    //     });
    // };

    // const handleLogin = (e) => {
    //     e.preventDefault(); // Ngăn reload trang
    
    //     setIsLoading(true); // Start loading
    
    //     axios.post("http://localhost:8080/api/login", {
    //         username: username,
    //         password: password
    //     })
    //     .then((response) => {
    //         const userData = response.data;
    //         login({
    //             username: userData.username,
    //             avatar: userData.avatar,
    //         });
    
    //         // Fetch email
    //         return axios.get(`http://localhost:8080/api/username/email?username=${username}`);
    //     })
    //     .then((emailResponse) => {
    //         const email = emailResponse.data;
    //         setEmail(email);
    //         // console.log("Email:", email);
    //         localStorage.setItem("user", JSON.stringify({ email: email }));
    
    //         // Check user role after setting email in localStorage
    //         return axios.get(`http://localhost:8080/api/role/${username}`);
    //     })
    //     .then((roleResponse) => {
    //         const userRole = roleResponse.data;
    //         // console.log(userRole)
    
    //         if (userRole === "ADMIN") {
    //             navigate('/admin');
    //         } else if (userRole === "USER") {
    //             navigate('/');
    //         } else {
    //             setMessage("Role không hợp lệ.");
    //             setMessageType("error");
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Lỗi đăng nhập hoặc kiểm tra quyền người dùng:", error);
    //         setMessage("Tài khoản hoặc mật khẩu không đúng.");
    //         setMessageType("error");
    //         setPassWord('');
    //     })
    //     .finally(() => {
    //         setIsLoading(false); // End loading
    //     });
    // };

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn reload trang
        setIsLoading(true); // Bắt đầu trạng thái loading
        setMessage(""); // Xóa thông báo lỗi cũ (nếu có)
    
        try {
            // Gửi yêu cầu đăng nhập
            const loginResponse = await axios.post("http://localhost:8080/api/login", {
                username: username,
                password: password,
            });
    
            // const userData = loginResponse.data;
            // Lấy email
            const emailResponse = await axios.get(`http://localhost:8080/api/username/email?username=${username}`);
            const email = emailResponse.data;
    
            // Lấy vai trò (role)
            const roleResponse = await axios.get(`http://localhost:8080/api/role/${username}`);
            const userRole = roleResponse.data;
    
            // Tạo đối tượng user đầy đủ
            const user = {
                email: email,
            };
    
            // Cập nhật UserContext và lưu vào localStorage
            login(user);
            localStorage.setItem("user", JSON.stringify(user));
    
            // Điều hướng theo role
            if (userRole === "ADMIN") {
                navigate('/admin');
            } else if (userRole === "USER") {
                navigate('/');
            } else {
                setMessage("Role không hợp lệ.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập hoặc kiểm tra quyền người dùng:", error);
            setMessage("Tài khoản hoặc mật khẩu không đúng.");
            setMessageType("error");
            setPassWord(''); // Xóa mật khẩu sau khi thất bại
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
        }
    };
    
    
    
    return (
        <div className={cx("bodic")}>
            <Form className={cx("wrap")} id="login-form" onSubmit={handleLogin}
             onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleLogin(e);
                }
            }}>
                <h1>Đăng nhập</h1>
                <Form.Group className={cx("input-box")}>
                    <Form.Control 
                        type="text"
                        className={cx("wrap-username")} 
                        id="username" 
                        placeholder="Tên đăng nhập" 
                        required
                        value={username}
                        onChange={(e) => setUserName(e.target.value)} />
                </Form.Group>

                <Form.Group className={cx("input-box")}>
                    <Form.Control 
                        type="password" 
                        className={cx("wrap-password")} 
                        id="password" 
                        placeholder="Mật khẩu" 
                        required
                        value={password}
                        onChange={(e) => setPassWord(e.target.value)} />
                </Form.Group>

                <div className={cx("remember-forgot")}>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={(e) => setRememberMe(e.target.checked)} />   
                        <span>Ghi nhớ</span>
                    </label>
                    <Link to={routes.forgot}>Quên mật khẩu</Link>
                </div>

                {message && (
                    <div className={cx("login-message", messageType)}>
                        <span>{message}</span>
                    </div>
                )}

                <div className={cx("login-link")}>
                    <Button 
                        className={cx("login-btn")} 
                        type="submit" 
                        disabled={isLoading}>
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </div>

                <div className={cx("register-link")}>
                    <span>Chưa có tài khoản? </span>
                    <Link to={routes.register}>Đăng ký</Link>
                </div>
            </Form>
        </div>
    );
}

export default Login;
