import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Plus,
  Atom,
  Dna,
} from "lucide-react";

import api from "../api/axios";

const WeeklyPlanner = () => {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("All");

  // --------------------------------
  // FETCH PLANNER
  // --------------------------------

  const fetchPlanner = async () => {
    try {
      const response = await api.get("/api/weekly-planner");

      console.log("Planner:", response.data);

      setPlanners(response.data.planners || []);
    } catch (error) {
      console.error("Failed to fetch planner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, []);

  // --------------------------------
  // FILTER
  // --------------------------------

  const filteredPlanners = useMemo(() => {
    if (subject === "All") {
      return planners;
    }

    return planners.filter(
      (planner) => planner.subject === subject
    );
  }, [planners, subject]);

  // --------------------------------
  // UPDATE CHECKBOX
  // --------------------------------

  const toggleTask = async (
    plannerId,
    taskId,
    completed
  ) => {
    try {
      // Optimistic UI
      setPlanners((previous) =>
        previous.map((planner) => {
          if (planner._id !== plannerId) {
            return planner;
          }

          return {
            ...planner,
            tasks: planner.tasks.map((task) =>
              task._id === taskId
                ? {
                    ...task,
                    completed,
                  }
                : task
            ),
          };
        })
      );

      await api.patch(
        `/api/weekly-planner/${plannerId}/task/${taskId}`,
        {
          completed,
        }
      );
    } catch (error) {
      console.error("Failed to update task:", error);

      fetchPlanner();
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
        Loading planner...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 px-6 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <span className="text-3xl">
              📅
            </span>

            <h1 className="text-3xl font-bold">
              WEEKLY PLANNER
            </h1>

          </div>

          <div className="flex items-center gap-2">

            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
              <Filter size={18} />
            </button>

            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
              <ArrowUpDown size={18} />
            </button>

            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
              <Sparkles size={18} />
            </button>

            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
              <Search size={18} />
            </button>

            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
              <SlidersHorizontal size={18} />
            </button>

            <button className="ml-3 flex items-center gap-2 rounded-lg bg-[#2383e2] px-4 py-2">
              <Plus size={18} />
              New
              <ChevronDown size={16} />
            </button>

          </div>
        </div>

        {/* TABS */}

        <div className="mt-5 flex items-center gap-2">

          <button className="flex items-center gap-2 rounded-lg bg-[#292929] px-4 py-2 text-sm">
            <Atom size={17} />
            PHYSICS & CHEMISTRY
          </button>

          <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-400">
            <Dna size={17} />
            BOTANY & ZOOLOGY
          </button>

          <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-400">
            <FileText size={17} />
            DETAILED LOG
          </button>

        </div>

      </header>

      {/* FILTER */}

      <div className="flex gap-3 border-b border-white/10 px-6 py-4">

        <button
          onClick={() => {
            if (subject === "All") {
              setSubject("Physics");
            } else if (subject === "Physics") {
              setSubject("Chemistry");
            } else {
              setSubject("All");
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-[#193b5c] px-3 py-2 text-sm text-[#55aaff]"
        >
          Subject: {subject}

          <ChevronDown size={15} />
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-[#193b5c] px-3 py-2 text-sm text-[#55aaff]">
          <CalendarDays size={15} />
          Week: This week
          <ChevronDown size={15} />
        </button>

        <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400">
          <Plus size={16} />
          Filter
        </button>

      </div>

      {/* CARDS */}

      <main className="p-6">

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {filteredPlanners.map((planner, index) => (

            <ChapterCard
              key={planner._id}
              planner={planner}
              index={index}
              toggleTask={toggleTask}
            />

          ))}

          {/* NEW PAGE */}

          <button className="flex min-h-[480px] items-center justify-center rounded-xl border border-white/10 bg-[#151515] text-gray-500 hover:bg-[#191919]">

            <div className="text-center">

              <Plus
                size={30}
                className="mx-auto"
              />

              <div className="mt-3 text-lg">
                New page
              </div>

            </div>

          </button>

        </div>

      </main>

    </div>
  );
};


// ============================================
// CHAPTER CARD
// ============================================

const ChapterCard = ({
  planner,
  index,
  toggleTask,
}) => {

  const completedCount = planner.tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = planner.tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedCount / totalTasks) * 100
        );

  const startDate = new Date(
    planner.weekStart
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endDate = new Date(
    planner.weekEnd
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-[480px] rounded-xl border border-white/10 bg-[#1c1c1c] p-5">

      {/* TITLE */}

      <h2 className="text-[17px] font-semibold">
        {index + 1}. {planner.title}
      </h2>

      {/* PROGRESS */}

      <div className="mt-4 flex items-center gap-3">

        <span className="min-w-[45px] text-sm">
          {progress}.0%
        </span>

        <div className="h-1 flex-1 rounded-full bg-[#373737]">

          <div
            className="h-full rounded-full bg-[#4caf7d] transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* CHECKBOXES */}

      <div className="mt-5 space-y-2.5">

        {planner.tasks.map((task) => (

          <label
            key={task._id}
            className="flex cursor-pointer items-center gap-2.5 text-sm"
          >

            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) =>
                toggleTask(
                  planner._id,
                  task._id,
                  e.target.checked
                )
              }
              className="h-4 w-4"
            />

            <span
              className={
                task.completed
                  ? "text-gray-500 line-through"
                  : "text-gray-300"
              }
            >
              {task.name}
            </span>

          </label>

        ))}

      </div>

      {/* SUBJECT */}

      <div className="mt-6">

        <span
          className={`rounded-md px-2.5 py-1 text-xs ${
            planner.subject === "Physics"
              ? "bg-[#225b8b]"
              : "bg-[#80651b]"
          }`}
        >
          {planner.subject}
        </span>

      </div>

      {/* DATE */}

      <div className="mt-3 text-sm text-gray-300">

        {startDate} → {endDate}

      </div>

    </div>
  );
};

export default WeeklyPlanner;