import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Search,
  ArrowUpDown,
  Plus,
  X,
  Trash2,
} from "lucide-react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../api/axios";

const AddTask = () => {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingPlanner, setEditingPlanner] = useState(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [taskNames, setTaskNames] = useState([
    {
      name: "Notes Rev",
      completed: false,
    },
    {
      name: "NCERT Rev",
      completed: false,
    },
  ]);

  const addTask = () => {
    const name = newTaskName.trim();

    if (!name) return;

    setTaskNames((prev) => [
      ...prev,
      {
        name,
        completed: false,
      },
    ]);

    setNewTaskName("");
  };

  const removeTask = (index) => {
    setTaskNames((prev) => prev.filter((_, taskIndex) => taskIndex !== index));
  };

  const [newTaskName, setNewTaskName] = useState("");

  const openCreateModal = () => {
    setEditingPlanner(null);

    setFormData({
      subject: "Physics",
    });

    setTaskNames([
      {
        name: "Notes Rev",
        completed: false,
      },
      {
        name: "NCERT Rev",
        completed: false,
      },
    ]);

    setNewTaskName("");
    setShowModal(true);
  };

  const savePlanner = async (e) => {
    e.preventDefault();

    if (taskNames.length === 0) {
      alert("Please add at least one checklist item.");
      return;
    }

    try {
      setCreating(true);

      const data = {
        subject: formData.subject,
        title: formData.title.trim(),
        tasks: taskNames.map((task) => ({
          ...(task._id && { _id: task._id }),
          name: task.name,
          completed: task.completed,
        })),
      };

      let response;

      if (editingPlanner) {
        response = await api.put(`/api/task/${editingPlanner._id}`, data);

        setPlanners((previous) =>
          previous.map((planner) =>
            planner._id === editingPlanner._id
              ? response.data.planner
              : planner,
          ),
        );
      } else {
        response = await api.post("/api/task", data);

        setPlanners((previous) => [...previous, response.data.planner]);
      }

      closeModal();
    } catch (error) {
      console.error("Save planner error:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to save chapter.");
    } finally {
      setCreating(false);
    }
  };

  const fetchPlanner = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/task");

      const data = response.data;

      const processedData = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
          ? data.tasks
          : Array.isArray(data?.planners)
            ? data.planners
            : [];

      setPlanners(processedData);
    } catch (error) {
      console.error("Failed to fetch planner:", error.response?.data || error);

      setPlanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleTask = async (plannerId, taskId, completed) => {
    try {
      setPlanners((previous) =>
        previous.map((planner) => {
          if (planner._id !== plannerId) {
            return planner;
          }

          const tasks = Array.isArray(planner.tasks) ? planner.tasks : [];

          return {
            ...planner,
            tasks: tasks.map((task) =>
              task._id === taskId
                ? {
                    ...task,
                    completed,
                  }
                : task,
            ),
          };
        }),
      );

      await api.patch(`/api/task/${plannerId}/task/${taskId}`, {
        completed,
      });
    } catch (error) {
      console.error("Failed to update task:", error);

      fetchPlanner();
    }
  };

  const deletePlanner = async (plannerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chapter?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/task/${plannerId}`);

      setPlanners((previous) =>
        previous.filter((planner) => planner._id !== plannerId),
      );
    } catch (error) {
      console.error("Failed to delete planner:", error);

      alert("Failed to delete chapter.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlanner(null);

    setFormData({
      subject: "Physics",
    });

    setTaskNames([
      {
        name: "Notes Rev",
        completed: false,
      },
      {
        name: "NCERT Rev",
        completed: false,
      },
    ]);

    setNewTaskName("");
  };

  const openEditModal = (planner) => {
    setEditingPlanner(planner);

    setFormData({
      subject: planner.subject || "Physics",
    });

    setTaskNames(
      Array.isArray(planner.tasks)
        ? planner.tasks.map((task) => ({
            _id: task._id,
            name: task.name,
            completed: Boolean(task.completed),
          }))
        : [],
    );

    setNewTaskName("");
    setShowModal(true);
  };

  const filteredPlanners = useMemo(() => {
    const safePlanners = Array.isArray(planners) ? planners : [];

    let result = [...safePlanners];

    // SUBJECT FILTER
    if (subject !== "All") {
      result = result.filter((planner) => planner.subject === subject);
    }

    // SEARCH
    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((planner) => {
        const plannerSubject = planner.subject?.toLowerCase() || "";

        return plannerSubject.includes(searchText);
      });
    }

    // SORT
    result.sort((a, b) => {
      const subjectA = a.subject?.toLowerCase() || "";
      const subjectB = b.subject?.toLowerCase() || "";

      if (sortOrder === "asc") {
        return subjectA.localeCompare(subjectB);
      }

      return subjectB.localeCompare(subjectA);
    });

    return result;
  }, [planners, subject, search, sortOrder]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
        Loading planner...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold leading-relaxed pb-4">Add Task</h2>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className="p-6 rounded-sm bg-(--bg-transparent-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color) flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-white/10"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                title={sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                <ArrowUpDown size={18} />
                <span>{sortOrder === "asc" ? "A → Z" : "Z → A"}</span>
              </button>

              <button className="rounded-lg bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color) flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-white/10">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-40 bg-transparent text-white outline-none placeholder:text-gray-500"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </button>

              <button
                onClick={openCreateModal}
                className="ml-3 flex items-center gap-2 px-4 py-2 text-xl font-semibold rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:scale-[95%]"
              >
                <Plus size={18} />
                New
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 border-b border-white/10 px-6 py-4">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Botany">Botany</option>
              <option value="Zoology">Zoology</option>
            </select>
          </div>
        </div>

        <main className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPlanners.map((planner) => (
              <ChapterCard
                key={planner._id}
                planner={planner}
                index={index}
                toggleTask={toggleTask}
                deletePlanner={deletePlanner}
                openEditModal={openEditModal}
              />
            ))}

            <button
              type="button"
              onClick={openCreateModal}
              className="flex min-h-[480px] items-center justify-center rounded-xl bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
            >
              <div className="text-center">
                <Plus size={30} className="mx-auto" />

                <div className="mt-3 text-lg">New page</div>
              </div>
            </button>
          </div>
        </main>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1c1c1c] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    {editingPlanner ? "Edit Chapter" : "New Chapter"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChapterCard = ({
  planner,
  index,
  toggleTask,
  deletePlanner,
  openEditModal,
}) => {
  const tasks = Array.isArray(planner.tasks) ? planner.tasks : [];

  const completedCount = tasks.filter((task) => task.completed).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="min-h-[480px] rounded-xl border border-white/10 bg-[#1c1c1c] p-5">
      <h2 className="text-[17px] font-semibold">
        {index + 1}. {planner.title}
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="min-w-[45px] text-sm">{progress}.0%</span>

        <div className="h-1 flex-1 rounded-full bg-[#373737]">
          <div
            className="h-full rounded-full bg-[#4caf7d] transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {tasks.map((task, taskIndex) => (
          <label
            key={task._id || `${planner._id}-task-${taskIndex}`}
            className="flex cursor-pointer items-center gap-2.5 text-sm"
          >
            <input
              type="checkbox"
              checked={Boolean(task.completed)}
              onChange={(e) =>
                toggleTask(planner._id, task._id, e.target.checked)
              }
              className="h-4 w-4"
            />

            <span
              className={
                task.completed ? "text-gray-500 line-through" : "text-gray-300"
              }
            >
              {task.name}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-6">
        <span
          className={`rounded-md px-2.5 py-1 text-xs ${
            planner.subject === "Physics"
              ? "bg-[#225b8b]"
              : planner.subject === "Chemistry"
                ? "bg-[#80651b]"
                : planner.subject === "Botany"
                  ? "bg-[#286044]"
                  : "bg-[#67427a]"
          }`}
        >
          {planner.subject}
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => openEditModal(planner)}
          className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/60 hover:cursor-pointer active:scale-[95%]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => deletePlanner(planner._id)}
          className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20 hover:cursor-pointer active:scale-[95%]"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddTask;
