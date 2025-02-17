import { useState,useEffect,useContext } from "react";
import { fetchUserId } from "~/hook/service";
import axios from "axios";
import { Button,Container,Form } from "react-bootstrap";
import routes from "~/config";
import { useNavigate } from "react-router-dom";
import { UserContext } from '~/pages/user/IsLogin';



import classNames from "classnames/bind";
import style from "../profile.module.scss"
const cx=classNames.bind(style)



function ChangePassword() {
    const [userId, setUserId] = useState("");
      const {logout } = useContext(UserContext); // Lấy thông tin người dùng từ context
    

    const [formDataChange, setFormDataChange] = useState({ oldPassword: "", newPassword: "",confirmPassword: "" });
    const [isChangePassword,setChangePassword]=useState(false)
    const [message, setMessage] = useState("");
    const [error,setError]=useState("")
    const navigate =useNavigate();

    


    const gotoReturn =() =>{
        navigate(routes.profile)

    }
    const gotoLogin =() =>{
        setTimeout(()=>{
            logout()
            navigate(routes.login)
           },2000)
    }

    

     useEffect(() => {
            fetchUserId(setUserId);
        }, []);


        const handleChangePassword = (e) => {
            setFormDataChange({ ...formDataChange, [e.target.name]: e.target.value });
        };

        
    
    
        async function handleSaveChangePassword() {
            if (formDataChange.newPassword !== formDataChange.confirmPassword) {
                setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
                setFormDataChange({
                    ...formDataChange,
                    newPassword: "", // Reset mật khẩu mới
                    confirmPassword: "", // Reset mật khẩu xác nhận
                });
                return;
            }
            try {
                const params = new URLSearchParams();
                params.append("oldPassword", formDataChange.oldPassword);
                params.append("newPassword", formDataChange.newPassword);
                params.append("confirmPassword", formDataChange.confirmPassword);
        
                const response = await axios.put(
                    `http://localhost:8080/api/change-password/${userId}`,
                    params,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );
        
                setMessage("Thay đổi mật khẩu thành công");
                setError(""); // Xóa thông báo lỗi nếu thành công
                setChangePassword(true); // Đánh dấu trạng thái đã đổi mật khẩu
                gotoLogin()


        
            } catch (error) {
                setChangePassword(false); // Đánh dấu thất bại nếu có lỗi

                setFormDataChange({
                    oldPassword:"",
                    newPassword: "", // Reset mật khẩu mới
                    confirmPassword: "", // Reset mật khẩu xác nhận
                });


                if (error.response) {
                    if (error.response.status === 400) {
                        setError(error.response.data || "Lỗi yêu cầu không hợp lệ!");
                    } else {
                        setError("Lỗi máy chủ, vui lòng thử lại sau!");
                    }
                } else {
                    setError("Không thể kết nối đến máy chủ!");
                }
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Ngăn reload trang (nếu input nằm trong form)
                handleSaveChangePassword()
            }
        };



        return (
            <Container className="mt-5">
                <Form onKeyDown={handleKeyDown} >
                    <Form.Group controlId="oldPassword">
                        <Form.Label>Mật khẩu hiện tại</Form.Label>
                        <Form.Control 
                            type="password"
                            name="oldPassword"
                            placeholder="Mật khẩu hiện tại"
                            value={formDataChange.oldPassword}
                            onChange={handleChangePassword}
                            className={cx("input-info")}
                        />
                    </Form.Group>
        
                    <Form.Group controlId="newPassword" className="my-3">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control 
                            type="password"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={formDataChange.newPassword}
                            onChange={handleChangePassword}
                            className={cx("input-info")}
                        />
                    </Form.Group>
        
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                        <Form.Control 
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formDataChange.confirmPassword}
                            onChange={handleChangePassword}
                            className={cx("input-info")}
                        />
                    </Form.Group>
                    {message && <p className={cx("message","text-success fw-bold mt-3")}>{message}</p>}
                    {error && <p className={cx("error","text-danger fw-bold mt-3")}>{error}</p>}

        
                    <Button 
                        variant="success" 
                        onClick={() => {
                            handleSaveChangePassword(); 
                            setChangePassword(true);
                        }} 
                        className={cx("mt-3", "btn-save")}
                        >
                        Xác nhận
                    </Button>

                    <Button variant="secondary" onClick={gotoReturn} className={cx("mt-3 mx-3","btn-cancer")}>
                        Hủy
                    </Button>
                </Form>
            </Container>
        );
    }


export default ChangePassword;