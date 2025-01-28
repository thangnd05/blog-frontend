import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {


    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.warn("Invalid user data in localStorage. Clearing...");
            localStorage.removeItem("user");
            return null;
        }
    });
    

    useEffect(() => {
        // Sửa ở đây: Đồng bộ localStorage mỗi khi user thay đổi
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");

        }
    }, [user]);

    const login = (userData) => {
        setUser(userData); // Sửa ở đây: Không thay đổi
    };

    const logout = () => {
        setUser(null); // Xóa thông tin user
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
