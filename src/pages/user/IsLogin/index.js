import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Thêm trạng thái error để lưu thông báo

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8080';

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('/api/check-session');
                const userData = response.data;
                // console.log('User data từ check-session:', userData); // Debug

                if (userData && userData.user_id) {
                    const roleResponse = await axios.get(`/api/role/${userData.username}`);
                    console.log('Role từ API:', roleResponse.data); // Debug
                    setUser({
                        userId: userData.user_id,
                        username: userData.username,
                        email: userData.email,
                        role: roleResponse.data,
                    });
                    setError(null);
                } else {
                    // console.warn('Session hợp lệ nhưng userId là null hoặc không tồn tại:', userData);
                    setUser(null);
                    setError('Không tìm thấy userId trong session');
                }
            } catch (error) {
                console.error('Lỗi kiểm tra session:', error.response?.data || error.message);
                setUser(null);
                setError('Lỗi khi kiểm tra session: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = (userData) => {
        if (!userData.userId) {
            console.warn('login gọi với userId null:', userData);
            setError('Không thể đăng nhập: userId không hợp lệ');
            return;
        }
        setUser(userData);
        setError(null);
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Lỗi đăng xuất:', error.response?.data || error.message);
            setUser(null);
            setError('Lỗi khi đăng xuất');
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};