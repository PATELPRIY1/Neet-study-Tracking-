// ...existing code...

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

const DEFAULT_TASKS = [
  {
    name: "Notes Rev",
    date: "",
    status: "pending",
  },
  {
    name: "NCERT Rev",
    date: "",
    status: "pending",
  },
];

const EMPTY_FORM = {
  subject: "Physics",
  date: "",
};

const AddTask = () => {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingPlanner, setEditingPlanner] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [taskNames, setTaskNames] = useState(DEFAULT_TASKS);

  const [newTaskName, setNewTaskName] = useState("");

  const addTask = () => {
    const name = newTaskName.trim();

    if (!name) return;

    setTaskNames((prev) => [
      ...prev,
      {
        name,
        date: "",
        status: "pending",
      },
    ]);

    setNewTaskName("");
  };

  const removeTask = (index) => {
    setTaskNames((prev) => prev.filter((_, taskIndex) => taskIndex !== index));
  };

  const openCreateModal = () => {
    setEditingPlanner(null);
    setFormData({ ...EMPTY_FORM });
    setTaskNames(DEFAULT_TASKS.map((task) => ({ ...task })));
    setNewTaskName("");
    setShowModal(true);
  };

  const savePlanner = async (e) => {
    e.preventDefault();

    if (taskNames.length === 0) {
      alert("Please add at least one checklist item.");
      return;
    }

    const newTaskWithoutDate = taskNames.some(
      (task) => !task._id && !task.date,
    );

    if (newTaskWithoutDate) {
      alert("Please enter a date for every new task.");
      return;
    }

    try {
      setCreating(true);

      const data = {
        subject: formData.subject,
        date: task.date || null,

        tasks: taskNames.map((task) => ({
          ...(task._id && { _id: task._id }),
          name: task.name.trim(),
          status: task.status || "pending",
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

  const updateTaskStatus = async (plannerId, taskId, status) => {
    try {
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
                    status,
                  }
                : task,
            ),
          };
        }),
      );

      await api.patch(`/api/task/${plannerId}/task/${taskId}`, {
        status,
      });
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error.response?.data || error,
      );

      fetchPlanner();
    }
  };

  const getTaskStatus = (task) => {
    if (task.status === "completed") {
      return {
        label: "Completed",
        className: "text-green-400",
      };
    }

    if (task.status === "half") {
      return {
        label: "Half Complete",
        className: "text-yellow-400",
      };
    }

    if (task.status === "missed") {
      return {
        label: "Missed",
        className: "text-red-400",
      };
    }

    return {
      label: "Pending",
      className: "text-gray-400",
    };
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
    setFormData({ ...EMPTY_FORM });
    setTaskNames(DEFAULT_TASKS.map((task) => ({ ...task })));
    setNewTaskName("");
  };

  const openEditModal = (planner) => {
    setEditingPlanner(planner);

    setFormData({
      subject: planner.subject || "Physics",
      date: planner.date
        ? new Date(planner.date).toISOString().split("T")[0]
        : "",
    });

    setTaskNames(
      Array.isArray(planner.tasks)
        ? planner.tasks.map((task) => ({
            _id: task._id,
            name: task.name,

            // Keep old status data
            status:
              task.status ||
              (task.completed === true ? "completed" : "pending"),
          }))
        : [],
    );

    setNewTaskName("");
    setShowModal(true);
  };

  const filteredPlanners = useMemo(() => {
    const safePlanners = Array.isArray(planners) ? planners : [];

    let result = [...safePlanners];

    if (subject !== "All") {
      result = result.filter((planner) => planner.subject === subject);
    }

    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((planner) => {
        const plannerSubject = planner.subject?.toLowerCase() || "";

        return (
          plannerSubject.includes(searchText) ||
          planner.tasks.some((task) =>
            task.name?.toLowerCase().includes(searchText),
          )
        );
      });
    }

    return result;
  }, [planners, subject, search]);

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
              <div className="rounded-lg bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
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
              </div>

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
            {filteredPlanners.map((planner, index) => (
              <ChapterCard
                key={planner._id}
                planner={planner}
                index={index}
                updateTaskStatus={updateTaskStatus}
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

              <form onSubmit={savePlanner} className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-white outline-none"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Botany">Botany</option>
                      <option value="Zoology">Zoology</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Task Date
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm text-gray-300">
                        Checklist items
                      </label>
                    </div>

                    <div className="space-y-2">
                      {taskNames.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-sm text-gray-500">
                          No checklist items yet
                        </div>
                      ) : (
                        taskNames.map((task, index) => (
                          <div
                            key={`${task._id || "new"}-${index}`}
                            className="rounded-lg border border-white/10 bg-[#111111] p-3"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={task.name}
                                onChange={(e) =>
                                  setTaskNames((prev) =>
                                    prev.map((item, taskIndex) =>
                                      taskIndex === index
                                        ? {
                                            ...item,
                                            name: e.target.value,
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Task name"
                                className="flex-1 rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-white outline-none"
                              />

                              <button
                                type="button"
                                onClick={() => removeTask(index)}
                                className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="mt-3">
                              <label className="mb-2 block text-xs text-gray-400">
                                Status
                              </label>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setTaskNames((prev) =>
                                      prev.map((item, taskIndex) =>
                                        taskIndex === index
                                          ? { ...item, status: "pending" }
                                          : item,
                                      ),
                                    )
                                  }
                                  className={`rounded-md px-3 py-1.5 text-xs ${
                                    task.status === "pending"
                                      ? "bg-gray-500/30 text-gray-200"
                                      : "bg-white/5 text-gray-400"
                                  }`}
                                >
                                  Pending
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setTaskNames((prev) =>
                                      prev.map((item, taskIndex) =>
                                        taskIndex === index
                                          ? { ...item, status: "half" }
                                          : item,
                                      ),
                                    )
                                  }
                                  className={`rounded-md px-3 py-1.5 text-xs ${
                                    task.status === "half"
                                      ? "bg-yellow-500/30 text-yellow-300"
                                      : "bg-white/5 text-gray-400"
                                  }`}
                                >
                                  Half
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setTaskNames((prev) =>
                                      prev.map((item, taskIndex) =>
                                        taskIndex === index
                                          ? { ...item, status: "completed" }
                                          : item,
                                      ),
                                    )
                                  }
                                  className={`rounded-md px-3 py-1.5 text-xs ${
                                    task.status === "completed"
                                      ? "bg-green-500/30 text-green-300"
                                      : "bg-white/5 text-gray-400"
                                  }`}
                                >
                                  Completed
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Add a task"
                        className="flex-1 rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-white outline-none placeholder:text-gray-500"
                      />

                      <button
                        type="button"
                        onClick={addTask}
                        className="rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/15"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-[#4caf7d] px-4 py-2 text-sm font-medium text-white hover:bg-[#57b88b] disabled:opacity-70"
                  >
                    {creating
                      ? "Saving..."
                      : editingPlanner
                        ? "Save Changes"
                        : "Create Chapter"}
                  </button>
                </div>
              </form>
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
  updateTaskStatus,
  deletePlanner,
  openEditModal,
}) => {
  const tasks = Array.isArray(planner.tasks) ? planner.tasks : [];

  const getEffectiveStatus = (task) => {
    if (task.status === "completed") {
      return "completed";
    }

    if (task.status === "half") {
      return "half";
    }

    if (!task.date) {
      return "pending";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate < today) {
      return "missed";
    }

    return "pending";
  };

  const getStatusInfo = (task) => {
    const status = getEffectiveStatus(task);

    switch (status) {
      case "completed":
        return {
          label: "Completed",
          className: "bg-green-500/15 text-green-400",
        };

      case "half":
        return {
          label: "Half Complete",
          className: "bg-yellow-500/15 text-yellow-400",
        };

      case "missed":
        return {
          label: "Missed",
          className: "bg-red-500/15 text-red-400",
        };

      default:
        return {
          label: "Pending",
          className: "bg-gray-500/15 text-gray-400",
        };
    }
  };

  const completedCount = tasks.filter(
    (task) => getEffectiveStatus(task) === "completed",
  ).length;

  const halfCount = tasks.filter(
    (task) => getEffectiveStatus(task) === "half",
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(((completedCount + halfCount * 0.5) / totalTasks) * 100);

  const formatChapterDate = (dateValue) => {
    if (!dateValue) return "No date";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="min-h-[480px] rounded-xl border border-white/10 bg-[#1c1c1c] p-5">
      <h2 className="text-[17px] font-semibold">
        {index + 1}. {planner.subject}
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="min-w-[45px] text-sm">{progress}%</span>

        <div className="h-1 flex-1 rounded-full bg-[#373737]">
          <div
            className="h-full rounded-full bg-[#4caf7d] transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 text-xs text-gray-500">
          📅 {formatChapterDate(planner.date)}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {tasks.map((task, taskIndex) => {
          const status = getStatusInfo(task);

          return (
            <div
              key={task._id || `${planner._id}-task-${taskIndex}`}
              className="rounded-lg border border-white/10 bg-[#111111] p-3"
            >
              {/* TASK NAME + STATUS */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm ${
                    status.label === "Completed"
                      ? "text-gray-500 line-through"
                      : "text-gray-300"
                  }`}
                >
                  {task.name}
                </span>

                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[11px] ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              {/* STATUS CONTROLS */}
              <div className="mt-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    updateTaskStatus(planner._id, task._id, "pending")
                  }
                  className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-gray-400 hover:bg-white/10"
                >
                  Pending
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateTaskStatus(planner._id, task._id, "half")
                  }
                  className="rounded-md bg-yellow-500/10 px-2 py-1 text-[10px] text-yellow-400 hover:bg-yellow-500/20"
                >
                  Half
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateTaskStatus(planner._id, task._id, "completed")
                  }
                  className="rounded-md bg-green-500/10 px-2 py-1 text-[10px] text-green-400 hover:bg-green-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBJECT */}
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

      {/* ACTIONS */}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => openEditModal(planner)}
          className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/20"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => deletePlanner(planner._id)}
          className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddTask;
