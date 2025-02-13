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

    
    const handleLogin = async (e) => {
        setIsLoading(true); // Bắt đầu trạng thái loading
        setMessage(""); // Xóa thông báo lỗi cũ (nếu có)
    
        try {
            // Gửi yêu cầu đăng nhập
            const loginResponse = await axios.post("http://192.168.100.205:8080/api/login", {
                username: username,
                password: password,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const emailRes=loginResponse.data
            
            // Kiểm tra xem username có phải là email không
            const isEmail = /\S+@\S+\.\S+/.test(username); // Kiểm tra định dạng email
            let user = {};

    
            if (isEmail) {
                // Nếu username là email, lưu trực tiếp vào localStorage
                user = {
                    email: username, // Lưu email nếu đúng định dạng
                };

                const roleResponse = await axios.get(`http://192.168.100.205:8080/api/role/${emailRes.username}`);
                const userRole = roleResponse.data;
                // Điều hướng theo role
            if (userRole === "ADMIN") {
                navigate('/admin');
            } else if (userRole === "USER") {
                navigate('/');
            } else {
                setMessage("Role không hợp lệ.");
                setMessageType("error");
            }

                
            } else {
                // Nếu không phải email, lấy thêm thông tin email từ backend
                const emailResponse = await axios.get(`http://192.168.100.205:8080/api/username/email?username=${username}`);
                const email = emailResponse.data;
    
                // Lấy vai trò (role)
                const roleResponse = await axios.get(`http://192.168.100.205:8080/api/role/${username}`);
                const userRole = roleResponse.data;
    
                // Tạo đối tượng user đầy đủ
                user = {
                    email: email,
                };
                // Điều hướng theo role
            if (userRole === "ADMIN") {
                navigate('/admin');
            } else if (userRole === "USER") {
                navigate('/');
            } else {
                setMessage("Role không hợp lệ.");
                setMessageType("error");
            }
                
            }
    
            // Cập nhật UserContext và lưu vào localStorage
            login(user);
            localStorage.setItem("user", JSON.stringify(user));
    
            
            
        } catch (error) {
            console.error("Lỗi đăng nhập hoặc kiểm tra quyền người dùng:", error);
            setMessage("Tài khoản hoặc mật khẩu không đúng.");
            setMessageType("error");
            setPassWord(''); // Xóa mật khẩu sau khi thất bại
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Ngăn reload trang (nếu input nằm trong form)
            handleLogin()
        }
    };
    
    
    
    
    return (
        <div className={cx("bodic")}>
            <Form className={cx("wrap")} id="login-form" onSubmit={handleLogin} onKeyDown={handleKeyDown}>
                <h1>Đăng nhập</h1>
                <Form.Group className={cx("input-box")}>
                    <Form.Control 
                        type="text"
                        className={cx("wrap-username")} 
                        id="username" 
                        placeholder="Tên đăng nhập hoặc Email " 
                        required
                        value={username}
                        onChange={(e) => setUserName(e.target.value)} 
                        // maxLength={10}
                        onInvalid={(e) => {
                            e.target.setCustomValidity("Vui lòng nhập tên đăng nhập hoặc Email!"); // Tùy chỉnh thông báo
                        }}
                        onInput={(e) => e.target.setCustomValidity("")} // Xóa thông báo khi người dùng nhập
                        />
                    
                </Form.Group>

                <Form.Group className={cx("input-box")}>
                    <Form.Control 
                        type="password" 
                        className={cx("wrap-password")} 
                        id="password" 
                        placeholder="Mật khẩu" 
                        required
                        value={password}
                        onInvalid={(e) => {
                            e.target.setCustomValidity("Vui lòng nhập mật khẩu!"); // Tùy chỉnh thông báo
                        }}
                        onInput={(e) => e.target.setCustomValidity("")} // Xóa thông báo khi người dùng nhập
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
