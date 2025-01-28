// import classNames from "classnames/bind";
// import style from './login.module.scss'
// import { Link,useNavigate } from "react-router-dom";
// import { useState,useContext } from "react";
// import axios from "axios";
// import { Form,Button } from "react-bootstrap";
// import { UserContext } from "../IsLogin";
// import routes from "~/config";


// const cx=classNames.bind(style);
// function Login() {
//     const [username,SetUserName]=useState('')
//     const [password,setPassWord]=useState('')
//     const { login } = useContext(UserContext); // Sử dụng hàm login từ context
//     const [email,setEmail]=useState(null)


//     const [rememberMe, setRememberMe] = useState(false);
//     const [message, setMessage] = useState('');
//     const [messageType, setMessageType] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = (e) => {
//         e.preventDefault(); // Ngăn reload trang

//         axios.post("http://localhost:8080/api/login", {
//             username: username,
//             password: password
//         })
//         .then((response) => {
//             const userData = response.data;
//             // Lưu thông tin người dùng vào state hoặc context nếu cần thiết
//             login({
//                 username: userData.username,
//                 avatar: userData.avatar,
//             });

//             axios.get(`http://localhost:8080/api/username/email?username=${username}`)
//             .then((response) => {
//                 const email = response.data;
//                 setEmail(email);
//                 console.log(email);

//                 // Lưu vào localStorage sau khi lấy được dữ liệu
//                 localStorage.setItem("user", JSON.stringify({
//                     // username: userData.username,
//                     email: email
//                     // ,avatar: userData.avatar
//                 }));
//             })
//             .catch((error) => {
//                 console.error("Error fetching email:", error);
//             });

//             // localStorage.setItem("user", JSON.stringify({
//             //     username: userData.username,
//             //     // ,avatar: userData.avatar,
//             // }));

//             // Kiểm tra role và điều hướng
//             axios.get(`http://localhost:8080/api/role/${username}`)
//             .then((roleResponse) => {
//                 const userRole = roleResponse.data;
//                 console.log("User Role:", userRole); // Kiểm tra giá trị role

//                 if (userRole === "ADMIN") {
//                     navigate('/admin');
//                 } else if (userRole === "USER") {
//                     navigate('/');
//                 } else {
//                     setMessage("Role không hợp lệ.");
//                     setMessageType("error");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Lỗi khi kiểm tra quyền người dùng:", error);
//                 setMessage("Lỗi khi kiểm tra quyền người dùng.");
//                 setMessageType("error");
//             });

//         })
//         .catch((error) => {
//             console.error("Lỗi đăng nhập:", error);
//             setMessage("Tài khoản hoặc mật khẩu không đúng.");
//             setMessageType("error");
//             setPassWord('');
//         });
//     };

    
//     return ( 
//         <div className={cx("bodic")}>
//             <Form className={cx("wrap")} id="login-form" onSubmit={handleLogin}
//              onKeyDown={(e)=>{
//                 if(e.key==='Enter'){
//                     handleLogin(e);
//                 }
//             }}>
//                 <h1>Đăng nhập</h1>
//                 <Form.Group className={cx("input-box")}>
//                     <Form.Control 
//                     type="text"
//                     className={cx("wrap-username")} 
//                     id="username" 
//                     placeholder="Tên đăng nhập" 
//                     required
//                     value={username}
//                     onChange={(e) => SetUserName(e.target.value)}/>

//                 </Form.Group>

//                 <Form.Group className={cx("input-box")}>
//                     <Form.Control 
//                     type="password" 
//                     className={cx("wrap-password")} 
//                     id="password" 
//                     placeholder="Mật khẩu" 
//                     required
//                     value={password}
//                     onChange={(e) => setPassWord(e.target.value)}/>

//                 </Form.Group>

//                 <div className={cx("remember-forgot")}>
//                     <label>
//                     <input 
//                         type="checkbox" 
//                         checked={rememberMe} 
//                         onChange={(e) => setRememberMe(e.target.checked)}/>   
//                         <span>Ghi nhớ</span>
//                     </label>
//                     <Link to={routes.forgot}>Quên mật khẩu</Link>
//                 </div>
//                 <div className={cx("login-message", messageType)}>
//                     {message && <span>{message}</span>}
//                 </div>

//                 <div className={cx("login-link")}>
//                     <Button className={cx("login-btn")} type="submit">Đăng nhập</Button>
//                 </div>
//                 <div className={cx("register-link")}>
//                     <span>Chưa có tài khoản? </span>
//                     <Link to={routes.register}>Đăng ký</Link>
//                 </div>
//             </Form>
//         </div>
        
//     )
    
                
// }


// export default Login;