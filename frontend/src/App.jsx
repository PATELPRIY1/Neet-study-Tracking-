import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import AddTask from "./pages/AddTask";
// import AddDayTask from "./pages/AddDayTask";
// import ViewTask from "./pages/ViewTask";
// import UpdateTask from "./pages/UpdateTask";
// import UpdateDayTask from "./pages/UpdateDayTask";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import ViewDayByTask from "./pages/ViewDayByTask";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import WeeklyPlanner from "./pages/WeeklyPlanner.jsx";

const MainLayout = () => {
  return (
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
};

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
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

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/task" element={<AddTask />} />
            {/* <Route path="/create-day-task" element={<AddDayTask />} /> */}
            {/* <Route path="/task" element={<ViewTask />} /> */}
            {/* <Route path="/view-day-by-task" element={<ViewDayByTask />} />
            <Route path="/update-day-task/:id" element={<UpdateDayTask />} />
            <Route path="/getdaytaskby/:id" element={<UpdateTask />} /> */}
            <Route path="/weekly-planner" element={<WeeklyPlanner/>} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
};

export default App;