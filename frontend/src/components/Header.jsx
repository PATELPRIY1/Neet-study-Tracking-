import { Logout } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

const Header = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const TaskRes = await api.get("/api/task");

        const responseData = TaskRes?.data || [];
        const fetchedTasks = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData.tasks)
            ? responseData.tasks
            : [];

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.completed === true || task.done === "completed",
  ).length;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });

      Swal.fire({
        title: "Logged out",
        text: "You have been logged out successfully.",
      });

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        title: "Logout failed",
        text: "Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <header className="bg-(--bg-transparent-color) py-4 px-8 flex justify-between items-center backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]">
      <h1 className="text-2xl font-bold">Neet Test Tracking</h1>

      <div className="flex items-center gap-4">
        <h4>
          {loading ? "..." : `${completedTasks}/${totalTasks}`}
        </h4>

        <button
          type="button"
          className="text-lg font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors"
          onClick={handleLogout}
        >
          <Logout />
        </button>
      </div>
    </header>
  );
};

export default Header;