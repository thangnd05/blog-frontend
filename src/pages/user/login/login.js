import classNames from "classnames/bind";
import style from './login.module.scss';
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { UserContext } from "../IsLogin";
import routes from "~/config";

const cx = classNames.bind(style);

function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const { user, login } = useContext(UserContext); // Lấy user từ context
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || '/';

    axios.defaults.withCredentials = true;

    // Điều hướng dựa trên user.role khi user thay đổi
   useEffect(() => {
    console.log('User trong useEffect:', user); // Kiểm tra giá trị user
    if (user) {
        console.log('Role:', user.role);
        if (user.role === 'ADMIN') {
            navigate(routes.admin);
        } else if (user.role === 'USER') {
            navigate(routes.home);
        }
    }
}, [user, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const loginResponse = await axios.post(
                'http://localhost:8080/api/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const userData = loginResponse.data;
            const roleResponse = await axios.get(`http://localhost:8080/api/role/${userData.username}`);
            const userRole = roleResponse.data;

            const userInfo = {
                userId: userData.user_id,
                username: userData.username,
                email: userData.email,
                role: userRole,
            };

            login(userInfo); // Cập nhật UserContext
        } catch (error) {
            if (error.response?.status === 401) {
                setMessage('Mật khẩu không đúng.');
            } else if (error.response?.status === 404) {
                setMessage('Tài khoản không tồn tại.');
            } else {
                setMessage('Đã xảy ra lỗi khi đăng nhập.');
            }
            setMessageType('error');
            setPassWord('');
            console.error('Lỗi đăng nhập:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin(event);
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
                        placeholder="Tên đăng nhập hoặc Email"
                        required
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        onInvalid={(e) => {
                            e.target.setCustomValidity("Vui lòng nhập tên đăng nhập hoặc Email!");
                        }}
                        onInput={(e) => e.target.setCustomValidity("")}
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
                            e.target.setCustomValidity("Vui lòng nhập mật khẩu!");
                        }}
                        onInput={(e) => e.target.setCustomValidity("")}
                        onChange={(e) => setPassWord(e.target.value)}
                    />
                </Form.Group>

                <div className={cx("remember-forgot")}>
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
                        disabled={isLoading}
                    >
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