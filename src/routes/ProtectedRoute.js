import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import { UserContext } from "~/pages/user/IsLogin";
import routes from "~/config";
import axios from "axios";

function PrivateRoute({ children }) {
    // const { user } = useContext(UserContext); // Lấy user từ UserContext
    const [role, setRole] = useState(null); // Giá trị mặc định là null

    
    const value = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        if(value===null){
            return;

        }
        axios
            .get(`http://localhost:8080/api/role?email=${value.email}`)
            .then((roleResponse) => {
                setRole(roleResponse.data); // Cập nhật role
                // console.log("API trả về role:", roleResponse.data);
            })
            .catch(() => {
                // console.error("Lỗi khi gọi API:", error);
            });  
}, [value]);



    // console.log("Role hiện tại:", role);

    // Nếu role chưa được xác định, hiển thị trạng thái chờ
    if (role === null) {
        return <h1>Bạn không có quyền truy cập ...</h1>;
        
    }

    // Nếu không phải ADMIN, chuyển hướng đến trang lỗi
    if (role !== "ADMIN") {
        console.log("Người dùng không có quyền admin, chuyển hướng...");
        return <Navigate to={routes.errorAdmin} replace />;
    }

    // Nếu hợp lệ, hiển thị nội dung con
    return children;
}

export default PrivateRoute;
