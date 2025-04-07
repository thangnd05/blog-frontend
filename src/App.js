import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import publicRoutes from "./routes";
import DefaultLayout from "./Layout/DefaultLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "./pages/user/IsLogin";
import ScrollHandler from "./Layout/ScrollToTopOnRouteChange";

function App() {
    return (
        <UserProvider>
            <Router>
                <ScrollHandler />
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = DefaultLayout;

                            if (route.path.startsWith("/admin")) {
                                // Route dành cho admin, kiểm tra role
                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <ProtectedRoute requiredRole="ADMIN">
                                                <Layout noContainer={route.noContainer || false}>
                                                    <Page />
                                                </Layout>
                                            </ProtectedRoute>
                                        }
                                    />
                                );
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout noContainer={route.noContainer || false}>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;