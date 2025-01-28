import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import publicRoutes from "./routes";
import DefaultLayout from "./Layout/DefaultLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "./pages/user/IsLogin";

function App() {
  return (
    <UserProvider>
      <Router>
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
                        <Layout>
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
                    <Layout>
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
