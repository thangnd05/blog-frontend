import { useState, useEffect } from "react";
import style from "./profile.module.scss";
import classNames from "classnames/bind";
import { fetchUserId } from "~/hook/service";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import routes from "~/config";

const cx = classNames.bind(style);

function InfoProfileTable() {
    const [userId, setUserId] = useState("");
    const [data, setData] = useState("");
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        membership: "", // Lưu membershipId
        membershipName: "" // Thêm để lưu tên membership
    });
    const [isEdit, setIsEdit] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const gotoChangePassword = () => {
        navigate(routes.changePassword);
    };

    useEffect(() => {
        fetchUserId(setUserId);
    }, []);

    useEffect(() => {
        if (!userId) return;

        let isMounted = true;

        const fetchData = async () => {
            try {
                // Lấy dữ liệu user
                const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
                if (isMounted) {
                    setData(response.data);
                    const membershipId = response.data.membershipId;

                    // Lấy tên membership từ membershipId
                    let membershipName = "";
                    if (membershipId) {
                        const membershipResponse = await axios.get(
                            `http://localhost:8080/api/memberships/${membershipId}/name`
                        );
                        membershipName = membershipResponse.data; // Giả sử API trả về chuỗi name
                    }

                    setFormData({
                        fullname: response.data.fullname || "",
                        username: response.data.username || "",
                        email: response.data.email || "",
                        membership: membershipId || "",
                        membershipName: membershipName || "N/A"
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setMessage("Lỗi khi tải dữ liệu!");
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            // Gửi yêu cầu PUT để cập nhật thông tin người dùng trên server
            await axios.put(`http://localhost:8080/api/user/${userId}`, {
                ...formData,
                membershipId: formData.membership // Gửi membershipId thay vì membershipName
            });
            setData(formData);
            setIsEdit(false);

            // Lấy thông tin người dùng từ localStorage
            const savedUser = JSON.parse(localStorage.getItem("user"));

            // Cập nhật email trong đối tượng người dùng
            const updatedUser = {
                ...savedUser,
                email: formData.email
            };

            // Lưu lại vào localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setMessage("Cập nhật thành công!");

            // Reload lại trang
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            setMessage("Cập nhật thất bại!");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSave(event);
        }
    };

    return (
        <div>
            {message && <p className={cx("message", "text-success fw-bold")}>{message}</p>}
            {data && Object.keys(data).length > 0 ? (
                <div className={cx("profile-container")}>
                    {isEdit ? (
                        <div>
                            <Form onKeyDown={handleKeyDown} onSubmit={handleSave}>
                                <Form.Group controlId="fullname">
                                    <Form.Label>Họ và Tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        className={cx("input-info")}
                                    />
                                </Form.Group>
                                <Button
                                    variant="success"
                                    className={cx("btn-save")}
                                    onClick={handleSave}
                                >
                                    Lưu thay đổi
                                </Button>
                                <Button
                                    variant="secondary"
                                    className={cx("btn-cancer", "mx-2")}
                                    onClick={() => setIsEdit(false)}
                                >
                                    Hủy
                                </Button>
                            </Form>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Họ và Tên:</strong> {data.fullname}</p>
                            <p><strong>Tên đăng nhập:</strong> {data.username}</p>
                            <p><strong>Email:</strong> {data.email}</p>
                            <p><strong>Thành viên:</strong> {formData.membershipName}</p>
                            <p><strong>Thời gian tạo:</strong> {data.created_at}</p>
                            <div className={cx("d-flex justify-content-between")}>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setIsEdit(true)}
                                    className={cx("btn-info")}
                                >
                                    Sửa thông tin
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    className={cx("btn-info")}
                                    onClick={gotoChangePassword}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
}

export default InfoProfileTable;