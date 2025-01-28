import axios from "axios";

export const fetchUserId = async (setUserId) => {
    // const userString = localStorage.getItem("user");
    // if (!userString) return;
    // const currentUser = JSON.parse(userString);
    // if (!currentUser.username) return;

    // try {
    //     const response = await axios.get(`http://localhost:8080/api/users?username=${currentUser.username}`);
    //     setUserId(response.data.user_id); // Lưu userId vào state
    //     console.log("id", response.data.user_id);
    // } catch (error) {
    //     console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    //     alert("Lỗi khi lấy thông tin người dùng. Vui lòng thử lại sau.");
    // }
    
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const currentUser = JSON.parse(userString);
    if (!currentUser.email) return;

    try {
        const response = await axios.get(`http://localhost:8080/api/mail/${currentUser.email}`);
        setUserId(response.data.user_id); // Lưu userId vào state
        // console.log("id", response.data.user_id);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        alert("Lỗi khi lấy thông tin người dùng. Vui lòng thử lại sau.");
    }
};
