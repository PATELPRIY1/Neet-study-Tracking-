import React from "react";
import { AddTask, DashboardCustomize, TaskAlt } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  async function fetchUser() {
    try {
      const userRes = await axios.get("http://localhost:3000/api/auth/user", {
        withCredentials: true,
      });
      setUser(userRes.data.User);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <aside className="bg-(--bg-transparent-color) py-4 px-6 flex flex-col gap-16 items-center col-span-1 h-full backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]">
      <h2 className="text-xl font-medium">
        {loading ? "Loading..." : user?.username || "Not Logged In"}
      </h2>
      <div className="flex md:flex-col flex-row flex-wrap gap-4">
        <Link
          to="/"
          className="text-lg flex gap-3 font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors"
        >
          <DashboardCustomize /> Dashboard
        </Link>
        <Link
          to="/create-task"
          className="text-lg flex gap-3 font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors"
        >
          <AddTask /> Add Task
        </Link>
        <Link
          to="/create-day-task"
          className="text-lg flex gap-3 font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors"
        >
          <AddTask /> Add Day Task
        </Link>
        <Link
          to="/view-task"
          className="text-lg flex gap-3 font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors"
        >
          <TaskAlt /> View Task
        </Link>
        <Link
          to="/view-day-by-task"
          className="text-lg flex gap-3 font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors"
        >
          <TaskAlt /> View Day by Task
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
