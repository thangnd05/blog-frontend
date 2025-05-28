import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

export const fetchUserId = async (setUserId) => {
    try {
        const response = await api.get("/api/check-session");
        const userData = response.data;

        if (userData && userData.user_id) {
            setUserId(userData.user_id); // Truy cập user_id trực tiếp
        } else {
            setUserId(null); // Không có user hoặc user_id
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra session:", error);
        setUserId(null);
    }
};