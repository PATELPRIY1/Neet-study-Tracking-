import { Logout } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

const Header = () => {
  const [dayTasks, setDayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dayTaskRes = await api.get("/api/getdaytasks");

        const responseData = dayTaskRes?.data || [];
        const fetchedDayTasks = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData.daytasks)
            ? responseData.daytasks
            : [];

        setDayTasks(fetchedDayTasks);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setDayTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalDayTasks = dayTasks.length;
  console.log("Total Day Tasks:", totalDayTasks);

  const completedDayTasks = dayTasks.filter(
    (task) => task.done === "completed",
  ).length;

  const navigate = useNavigate();

  const handleLogout = () => {
    api.post("/api/auth/logout").then(() => {
      Swal.fire({
        title: "Logged out",
        text: "You have been logged out successfully.",
      });
      navigate("/login");
    });
  };
  return (
    <header className="bg-(--bg-transparent-color) py-4 px-8  flex justify-between items-center backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]">
      <h1 className="text-2xl font-bold">Neet Test Tracking</h1>
      <div className="flex items-center gap-4">
        <h4>
          {completedDayTasks}/{totalDayTasks}
        </h4>
        <button className="text-lg font-medium hover:text-(--secondary-color) active:scale-98 active:text-(--secondary-color) cursor-pointer transition-colors">
          <Logout onClick={handleLogout} />
        </button>
      </div>
    </header>
  );
};

export default Header;
