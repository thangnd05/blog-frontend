// src/routes/ProtectedRoute.js
import { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '~/pages/user/IsLogin';
import routes from '~/config';
import axios from 'axios';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(UserContext); // lấy user và loading từ context
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Gọi API lấy role nếu đã có user
      axios
        .get(`http://localhost:8080/api/role?email=${user.email}`)
        .then((res) => setRole(res.data))
        .catch(() => setRole(''));
    }
  }, [user]);

  if (loading) {
    return <div>Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (!user) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  if (requiredRole === 'ADMIN' && role === null) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  if (requiredRole === 'ADMIN' && role !== 'ADMIN') {
    return <Navigate to={routes.errorAdmin} replace />;
  }

  // ✅ Tất cả đều hợp lệ => hiển thị nội dung
  return children;
}

export default ProtectedRoute;
