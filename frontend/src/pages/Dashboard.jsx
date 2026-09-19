import React, { useEffect, useMemo, useState } from "react";
import IndexLineChart from "../components/LineChart";
import api from "../api/axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [weeklyPlanner, setWeeklyPlanner] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [taskRes, weeklyPlannerRes] = await Promise.all([
          api.get("/api/task"),
          api.get("/api/weekly-planner"),
        ]);

        // -----------------------------
        // TASKS
        // -----------------------------
        const taskData = taskRes.data;

        const fetchedTasks = Array.isArray(taskData)
          ? taskData
          : Array.isArray(taskData?.tasks)
            ? taskData.tasks
            : [];

        // -----------------------------
        // WEEKLY PLANNER
        // -----------------------------
        const plannerData = weeklyPlannerRes.data;

        const fetchedWeeklyPlanner = Array.isArray(plannerData)
          ? plannerData
          : Array.isArray(plannerData?.planners)
            ? plannerData.planners
            : Array.isArray(plannerData?.weeklyPlanner)
              ? plannerData.weeklyPlanner
              : [];

        setTasks(fetchedTasks);
        setWeeklyPlanner(fetchedWeeklyPlanner);
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error.response?.data || error,
        );

        setTasks([]);
        setWeeklyPlanner([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // ALL CHECKLIST TASKS
  // ==========================================

  const allTasks = useMemo(() => {
    return tasks.flatMap((chapter) =>
      Array.isArray(chapter.tasks) ? chapter.tasks : [],
    );
  }, [tasks]);

  // ==========================================
  // TASK STATISTICS
  // ==========================================

  const totalTasks = allTasks.length;

  const completedTasks = allTasks.filter(
    (task) => task.completed === true,
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const completionPercent =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  // ==========================================
  // CHAPTER STATISTICS
  // ==========================================

  const totalChapters = tasks.length;

  // ==========================================
  // WEEKLY PLANNER TASKS
  // ==========================================

  const allWeeklyTasks = useMemo(() => {
    return weeklyPlanner.flatMap((planner) =>
      Array.isArray(planner.tasks) ? planner.tasks : [],
    );
  }, [weeklyPlanner]);

  const totalDayTasks = allWeeklyTasks.length;

  const completedDayTasks = allWeeklyTasks.filter(
    (task) => task.completed === true,
  ).length;

  const pendingDayTasks = totalDayTasks - completedDayTasks;

  const dayTaskCompletionPercent =
    totalDayTasks === 0
      ? 0
      : Math.round((completedDayTasks / totalDayTasks) * 100);

  // ==========================================
  // RECENT CHAPTERS
  // ==========================================

  const recentChapters = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )
      .slice(0, 6);
  }, [tasks]);

  return (
    <div className="space-y-8 p-6">
      {/* ========================================
          HEADER
      ======================================== */}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-sm text-gray-400">
          Overview of your study tasks and progress.
        </p>
      </div>

      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL TASKS */}

        <div className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Total Tasks
          </p>

          <p className="mt-4 text-4xl font-semibold">
            {totalTasks}
          </p>

          <p className="mt-2 text-sm text-(--secondary-color)">
            Checklist items across all chapters.
          </p>
        </div>

        {/* COMPLETED */}

        <div className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Completed
          </p>

          <p className="mt-4 text-4xl font-semibold">
            {completedTasks}
          </p>

          <p className="mt-2 text-sm text-(--secondary-color)">
            Checklist items completed.
          </p>
        </div>

        {/* PENDING */}

        <div className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Pending
          </p>

          <p className="mt-4 text-4xl font-semibold">
            {pendingTasks}
          </p>

          <p className="mt-2 text-sm text-(--secondary-color)">
            Checklist items remaining.
          </p>
        </div>

        {/* CHAPTERS */}

        <div className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Chapters
          </p>

          <p className="mt-4 text-4xl font-semibold">
            {totalChapters}
          </p>

          <p className="mt-2 text-sm text-(--secondary-color)">
            Study chapters added.
          </p>
        </div>
      </div>

      {/* ========================================
          PROGRESS
      ======================================== */}

      <div className="grid gap-4 md:grid-cols-2">
        {/* TASK PROGRESS */}

        <div className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Task Progress
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                {completionPercent}%
              </h3>
            </div>

            <p className="text-sm text-(--secondary-color)">
              {completedTasks} of {totalTasks} completed
            </p>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-(--accent-color) transition-all duration-500"
              style={{
                width: `${completionPercent}%`,
              }}
            />
          </div>
        </div>

        {/* DAILY PROGRESS */}

        <div className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Weekly Planner
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                {dayTaskCompletionPercent}%
              </h3>
            </div>

            <p className="text-sm text-(--secondary-color)">
              {completedDayTasks} of {totalDayTasks} completed
            </p>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-(--accent-color) transition-all duration-500"
              style={{
                width: `${dayTaskCompletionPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================
          RECENT CHAPTERS
      ======================================== */}

      <section className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Recent Chapters
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your recently added study chapters.
            </p>
          </div>

          <span className="text-sm text-gray-400">
            {totalChapters} chapters
          </span>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-gray-400">
            Loading...
          </p>
        ) : recentChapters.length === 0 ? (
          <p className="mt-6 text-sm text-gray-300">
            No chapters available yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentChapters.map((chapter) => {
              const chapterTasks = Array.isArray(chapter.tasks)
                ? chapter.tasks
                : [];

              const chapterCompleted = chapterTasks.filter(
                (task) => task.completed === true,
              ).length;

              const chapterTotal = chapterTasks.length;

              const chapterProgress =
                chapterTotal === 0
                  ? 0
                  : Math.round(
                      (chapterCompleted / chapterTotal) * 100,
                    );

              return (
                <div
                  key={chapter._id}
                  className="rounded-2xl border border-white/10 bg-(--bg-transparent-2-color) p-5"
                >
                  {/* SUBJECT */}

                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs ${
                        chapter.subject === "Physics"
                          ? "bg-[#225b8b]"
                          : chapter.subject === "Chemistry"
                            ? "bg-[#80651b]"
                            : chapter.subject === "Botany"
                              ? "bg-[#286044]"
                              : "bg-[#67427a]"
                      }`}
                    >
                      {chapter.subject}
                    </span>

                    <span className="text-xs text-gray-500">
                      {chapterTotal} items
                    </span>
                  </div>

                  {/* CHAPTER NAME */}

                  <h3 className="mt-5 text-lg font-semibold">
                    {chapter.subject} Chapter
                  </h3>

                  {/* PROGRESS */}

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Progress
                      </span>

                      <span className="text-gray-300">
                        {chapterCompleted}/{chapterTotal}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-(--accent-color) transition-all"
                        style={{
                          width: `${chapterProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================
          WEEKLY PLANNER SUMMARY
      ======================================== */}

      <section className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Weekly Planner
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Current checklist progress.
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-semibold">
              {completedDayTasks}/{totalDayTasks}
            </p>

            <p className="text-xs text-gray-500">
              completed
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Total
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {totalDayTasks}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {completedDayTasks}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {pendingDayTasks}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          DAILY TASK CHART
      ======================================== */}

      <section className="rounded-xl border border-white/10 bg-(--bg-transparent-color) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Daily Task Trends
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Track your daily progress.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <IndexLineChart />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;