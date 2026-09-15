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
  X,
  Trash2,
} from "lucide-react";

import api from "../api/axios";

const WeeklyPlanner = () => {
  const getMonday = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);

    return d;
  };

  const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const calculateWeekDates = (week) => {
    const today = new Date();

    let monday = getMonday(today);

    if (week === "Next week") {
      monday.setDate(monday.getDate() + 7);
    }

    if (week === "Previous week") {
      monday.setDate(monday.getDate() - 7);
    }

    const sunday = new Date(monday);

    sunday.setDate(sunday.getDate() + 6);

    return {
      weekStart: formatDateInput(monday),
      weekEnd: formatDateInput(sunday),
    };
  };

  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("All");
  const [weekFilter, setWeekFilter] = useState("This week");

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingPlanner, setEditingPlanner] = useState(null);

  const initialWeek = calculateWeekDates("This week");

  const [formData, setFormData] = useState({
    title: "",
    subject: "Physics",
    weekStart: initialWeek.weekStart,
    weekEnd: initialWeek.weekEnd,
  });

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
    const dates = calculateWeekDates("This week");

    setEditingPlanner(null);

    setFormData({
      title: "",
      subject: "Physics",
      weekStart: dates.weekStart,
      weekEnd: dates.weekEnd,
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

  const fetchPlanner = async () => {
    try {
      const response = await api.get("/api/weekly-planner");

      console.log("Planner:", response.data);

      setPlanners(
        Array.isArray(response.data.planners) ? response.data.planners : [],
      );
    } catch (error) {
      console.error("Failed to fetch planner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, []);

  const getDateOnly = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getStartOfWeek = (date) => {
    const d = getDateOnly(date);
    const day = d.getDay();

    // Monday = start of week
    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);

    return d;
  };

  const isSameDay = (a, b) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const filteredPlanners = useMemo(() => {
    const today = getDateOnly(new Date());
    const currentWeekStart = getStartOfWeek(today);

    let weekStart = null;

    if (weekFilter === "This week") {
      weekStart = currentWeekStart;
    }

    if (weekFilter === "Next week") {
      weekStart = new Date(currentWeekStart);
      weekStart.setDate(weekStart.getDate() + 7);
    }

    if (weekFilter === "Previous week") {
      weekStart = new Date(currentWeekStart);
      weekStart.setDate(weekStart.getDate() - 7);
    }

    return planners.filter((planner) => {
      // Subject filter
      if (subject !== "All" && planner.subject !== subject) {
        return false;
      }

      // All weeks
      if (!weekStart) {
        return true;
      }

      const plannerStart = getDateOnly(planner.weekStart);

      return isSameDay(plannerStart, weekStart);
    });
  }, [planners, subject, weekFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const savePlanner = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.weekStart || !formData.weekEnd) {
      alert("Please fill all required fields.");
      return;
    }

    if (taskNames.length === 0) {
      alert("Please add at least one checklist item.");
      return;
    }

    if (new Date(formData.weekEnd) < new Date(formData.weekStart)) {
      alert("End date cannot be before start date.");
      return;
    }

    try {
      setCreating(true);

      const data = {
        title: formData.title.trim(),
        subject: formData.subject,
        weekStart: formData.weekStart,
        weekEnd: formData.weekEnd,
        tasks: taskNames.map((task) => ({
          ...(task._id && { _id: task._id }),
          name: task.name,
          completed: task.completed,
        })),
      };

      let response;

      if (editingPlanner) {
        // EDIT
        response = await api.put(`/weekly-planner/${editingPlanner._id}`, data);

        setPlanners((previous) =>
          previous.map((planner) =>
            planner._id === editingPlanner._id
              ? response.data.planner
              : planner,
          ),
        );
      } else {
        // CREATE
        response = await api.post("/weekly-planner", data);

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

  const toggleTask = async (plannerId, taskId, completed) => {
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
                : task,
            ),
          };
        }),
      );

      await api.patch(`/weekly-planner/${plannerId}/task/${taskId}`, {
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
      await api.delete(`/weekly-planner/${plannerId}`);

      setPlanners((previous) =>
        previous.filter((planner) => planner._id !== plannerId),
      );
    } catch (error) {
      console.error("Failed to delete planner:", error);

      alert("Failed to delete chapter.");
    }
  };

  const closeModal = () => {
    const dates = calculateWeekDates("This week");

    setShowModal(false);
    setEditingPlanner(null);

    setWeekFilter("This week");

    setFormData({
      title: "",
      subject: "Physics",
      weekStart: dates.weekStart,
      weekEnd: dates.weekEnd,
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
      title: planner.title || "",
      subject: planner.subject || "Physics",
      weekStart: formatDateInput(new Date(planner.weekStart)),
      weekEnd: formatDateInput(new Date(planner.weekEnd)),
    });

    setTaskNames(
      planner.tasks?.map((task) => ({
        _id: task._id,
        name: task.name,
        completed: task.completed,
      })) || [],
    );

    setNewTaskName("");
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
        Loading planner...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold leading-relaxed pb-4">
        Weekly Task
      </h2>

      <div className="p-6 rounded-sm bg-(--bg-transparent-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)">
        <div className="flex items-end justify-end">
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

        <div className="flex justify-between items-center">
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

          <div className="flex gap-3 border-b border-white/10 px-6 py-4">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg bg-[#193b5c] px-3 py-2 text-sm text-[#55aaff] outline-none"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Botany">Botany</option>
              <option value="Zoology">Zoology</option>
            </select>

            <select
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="rounded-lg border-none bg-[#193b5c] px-3 py-2 text-sm text-[#55aaff] outline-none"
            >
              <option value="This week">This week</option>

              <option value="Next week">Next week</option>

              <option value="Previous week">Previous week</option>

              <option value="All weeks">All weeks</option>
            </select>

            <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400">
              <Plus size={16} />
              Filter
            </button>
          </div>
        </div>

        <main className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPlanners.map((planner, index) => (
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

                  <p className="mt-1 text-sm text-gray-500">
                    Add a chapter to your weekly planner.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={savePlanner} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Chapter Name
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Motion in a Plane"
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#2383e2]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#2383e2]"
                  >
                    <option value="Physics">Physics</option>

                    <option value="Chemistry">Chemistry</option>

                    <option value="Botany">Botany</option>

                    <option value="Zoology">Zoology</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="weekStart"
                      value={formData.weekStart}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#2383e2]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      End Date
                    </label>

                    <input
                      type="date"
                      name="weekEnd"
                      value={formData.weekEnd}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#2383e2]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm text-gray-300">Checklist</label>

                    <span className="text-xs text-gray-500">
                      {taskNames.length} items
                    </span>
                  </div>

                  <div className="space-y-2">
                    {taskNames.map((task, index) => (
                      <div
                        key={task._id || index}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5"
                      >
                        <label className="flex flex-1 cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => {
                              const completed = e.target.checked;

                              setTaskNames((previous) =>
                                previous.map((item, taskIndex) =>
                                  taskIndex === index
                                    ? {
                                        ...item,
                                        completed,
                                      }
                                    : item,
                                ),
                              );
                            }}
                            className="h-4 w-4 cursor-pointer accent-[#2383e2]"
                          />

                          <span
                            className={
                              task.completed
                                ? "text-sm text-gray-500 line-through"
                                : "text-sm text-gray-300"
                            }
                          >
                            {task.name}
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="rounded-md p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTask();
                        }
                      }}
                      placeholder="Add checklist item..."
                      className="flex-1 rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#2383e2]"
                    />

                    <button
                      type="button"
                      onClick={addTask}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg px-4 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-[#2383e2] px-5 py-2.5 text-sm font-medium transition hover:bg-[#1d6fbd] disabled:cursor-not-allowed disabled:opacity-50"
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
  toggleTask,
  deletePlanner,
  openEditModal,
}) => {
  const tasks = Array.isArray(planner.tasks) ? planner.tasks : [];

  const completedCount = tasks.filter((task) => task.completed).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  const startDate = new Date(planner.weekStart).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endDate = new Date(planner.weekEnd).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

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

      <div className="mt-3 text-sm text-gray-300">
        {startDate} → {endDate}
      </div>

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
          className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
