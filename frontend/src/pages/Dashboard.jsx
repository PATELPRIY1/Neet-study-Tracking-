import React, { useEffect, useState } from "react";
import axios from "axios";
import IndexLineChart from "../components/LineChart";
const VITE_API_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [dayTasks, setDayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const checkAuthAndFetch = async () => {
    try {
      // ✅ Step 1: Check if user is logged in
      const userRes = await axios.get(
        `${VITE_API_URL}/api/auth/user`,
        { withCredentials: true }
      );

      console.log("User:", userRes.data);

      // ✅ Step 2: If success → fetch dashboard data
      const [taskRes, dayTaskRes] = await Promise.all([
        axios.get(`${VITE_API_URL}/api/get-task`, {
          withCredentials: true,
        }),
        axios.get(`${VITE_API_URL}/api/getdaytasks`, {
          withCredentials: true,
        }),
      ]);

      const fetchedTasks = Array.isArray(taskRes.data.tasks)
        ? taskRes.data.tasks
        : [];

      const fetchedDayTasks = Array.isArray(dayTaskRes.data)
        ? dayTaskRes.data
        : Array.isArray(dayTaskRes.data.daytasks)
        ? dayTaskRes.data.daytasks
        : [];

      setTasks(fetchedTasks);
      setDayTasks(fetchedDayTasks);
    } catch (error) {
      console.error("Auth or data error:", error);

      // ❗ IMPORTANT: redirect if unauthorized
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  checkAuthAndFetch();
}, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed",
  ).length;
  const totalDayTasks = dayTasks.length;

  const pendingDayTasks = dayTasks.filter(
    (task) => task.done !== "completed",
  ).length;

  const completedDayTasks = dayTasks.filter(
    (task) => task.done === "completed",
  ).length;
  const dayTaskCompletionPercent =
    totalDayTasks === 0
      ? 0
      : Math.round((completedDayTasks / totalDayTasks) * 100);
  const completionPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm">Overview of your tasks and daily tracking.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
          <p className="text-sm uppercase tracking-[0.2em]">Total Tasks</p>
          <p className="mt-4 text-4xl font-semibold">{totalTasks}</p>
          <p className="mt-2 text-sm text-(--secondary-color)">
            All tasks added in the system.
          </p>
        </div>
        <div className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
          <p className="text-sm uppercase tracking-[0.2em]">Completed</p>
          <p className="mt-4 text-4xl font-semibold">{completedTasks}</p>
          <p className="mt-2 text-sm text-(--secondary-color)">
            Tasks marked as completed.
          </p>
        </div>
        <div className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
          <p className="text-sm uppercase tracking-[0.2em]">Pending</p>
          <p className="mt-4 text-4xl font-semibold">{pendingTasks}</p>
          <p className="mt-2 text-sm text-(--secondary-color)">
            Tasks still pending review or completion.
          </p>
        </div>
        <div className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
          <p className="text-sm uppercase tracking-[0.2em]">Day Tasks</p>
          <p className="mt-4 text-4xl font-semibold">
            {completedDayTasks}/{totalDayTasks}
          </p>

          <p className="mt-2 text-sm text-(--secondary-color)">
            Daily study tasks available.
          </p>
        </div>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em]">
                Completion Progress
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {completionPercent}%
              </h3>
            </div>
            <p className="text-sm text-(--secondary-color)">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-(--accent-color) transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em]">
                Day Completion Progress
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {dayTaskCompletionPercent}%
              </h3>
            </div>
            <p className="text-sm text-(--secondary-color)">
              {completedDayTasks} of {totalDayTasks} tasks completed
            </p>
          </div>
          <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-(--accent-color) transition-all duration-500"
              style={{ width: `${dayTaskCompletionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <section className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <span className="text-sm text-gray-400">Latest updates</span>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-gray-400">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="mt-6 text-sm text-gray-300">No tasks available yet.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.slice(0, 6).map((taskItem) => (
              <div
                key={taskItem._id}
                className="rounded-3xl bg-(--bg-transparent-2-color) p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  {taskItem.subject || "Unknown"}
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  {taskItem.topic || "No topic"}
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  Status: {taskItem.status || "pending"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150 p-6 border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Daily Task Trends</h2>
          <span className="text-sm text-gray-400">Track your daily progress</span>
        </div>
        <div className="mt-6">
          <IndexLineChart />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
