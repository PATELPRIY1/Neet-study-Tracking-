import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import AddTask from "./pages/AddTask";
import AddDayTask from "./pages/AddDayTask";
import ViewTask from "./pages/ViewTask";
import UpdateTask from "./pages/UpdateTask";
import UpdateDayTask from "./pages/UpdateDayTask";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ViewDayByTask from "./pages/ViewDayByTask";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout wrapper for pages with components
const MainLayout = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 min-h-screen">
    <Sidebar />
    <div className="col-span-2 md:col-span-2 lg:col-span-5 content-wrapper flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
);

// Layout wrapper for auth pages (no components)
const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center">
    {children}
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Layout Components */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Registration />
            </AuthLayout>
          }
        />

        {/* Main Routes - With Layout Components */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-task" element={<AddTask />} />
          <Route path="/create-day-task" element={<AddDayTask />} />
          <Route path="/view-task" element={<ViewTask />} />
          <Route path="/view-day-by-task" element={<ViewDayByTask />} />
          <Route path="/update-day-task/:id" element={<UpdateDayTask />} />
          <Route path="/getdaytaskby/:id" element={<UpdateTask />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
