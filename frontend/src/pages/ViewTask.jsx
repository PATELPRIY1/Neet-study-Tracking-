import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Delete, EditSquare } from "@mui/icons-material";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function ViewTask() {
  const [task, setTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const rowsPerPage = 15;

  useEffect(() => {
    axios
      .get(`${VITE_API_URL}/api/get-task`, {
        withCredentials: true,
      })
      .then((res) => {
        setTask(res.data.tasks);
        setLoading(false); // ✅ correct place
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, []);

  const filteredTasks =
    filter === "all" ? task : task.filter((t) => t.status === filter);

  const completedCount = task.filter((t) => t.status === "completed").length;
  const pendingCount = task.filter((t) => t.status === "pending").length;

  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const displayedTasks = filteredTasks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  async function handleDelete(taskId) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${VITE_API_URL}/api/delete-task/${taskId}`, {
          withCredentials: true,
        });
        setTask((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting task:", err);
        Swal.fire("Error!", "Failed to delete the task.", "error");
      }
    }
  }

  async function handleDeleteAll() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete all your tasks and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${VITE_API_URL}/api/delete-all-tasks`, {
          withCredentials: true,
        });
        setTask([]);
        Swal.fire("Deleted!", "All your tasks have been deleted.", "success");
      } catch (err) {
        console.error("Error deleting tasks:", err);
        Swal.fire("Error!", "Failed to delete the tasks.", "error");
      }
    }
  }

  async function handleStatusChange(taskId) {
    const result = await Swal.fire({
      title: "Change Status",
      text: "Are you sure you want to change the status of this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      const currentTask = task.find((t) => t._id === taskId);
      if (!currentTask) return;

      const newStatus =
        currentTask.status === "pending" ? "completed" : "pending";

      try {
        await axios.put(
          `${VITE_API_URL}/api/update-task-status/${taskId}/status`,
          {
            status: newStatus,
          },
          {
            withCredentials: true,
          },
        );
        // Update the task status in the UI
        setTask((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task,
          ),
        );
        Swal.fire(
          "Status Updated!",
          `Task status changed to ${newStatus}.`,
          "success",
        );
      } catch (err) {
        console.error("Error updating task status:", err);
        Swal.fire("Error!", "Failed to update the task status.", "error");
      }
    }
  }

  return (
    <div className="p-4">
      <section>
        <h2 className="text-xl font-semibold leading-relaxed pb-4">
          View Task
        </h2>
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="mb-4 flex gap-4">
                {["all", "completed", "pending"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-md font-medium py-2 px-4 rounded-md cursor-pointer capitalize ${filter === f ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  >
                    {f} (
                    {f === "all"
                      ? displayedTasks.length
                      : f === "completed"
                        ? completedCount
                        : pendingCount}
                    )
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <div className="mb-4">
                  <Link
                    to="/create-task"
                    className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md cursor-pointer"
                  >
                    Create New Task
                  </Link>
                </div>
                <div className="mb-4">
                  <button
                    onClick={handleDeleteAll}
                    className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md cursor-pointer"
                  >
                    Delete All Tasks
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/25 bg-(--bg-transparent-color) shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[14px] backdrop-saturate-150">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-(--bg-transparent-2-color) text-left text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3">No.</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Status Change</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10 text-(--secondary-color)">
                  {task.length > 0 ? (
                    task.map((taskItem, index) => {
                      const isCompleted = taskItem.status === "completed";
                      const statusLabel = isCompleted ? "Completed" : "Pending";
                      const statusClass = isCompleted
                        ? "bg-green-900"
                        : "bg-yellow-800";

                      // Format date: DD/MM/YYYY HH:MM with validation
                      const dateObj = new Date(taskItem.createdAt);
                      const formattedDate = isNaN(dateObj.getTime())
                        ? "Invalid Date"
                        : dateObj.toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });
                      return (
                        <tr
                          key={taskItem._id}
                          className="hover:bg-white/5 capitalize"
                        >
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 text-xs text-gray-300">
                            {formattedDate}
                          </td>
                          <td className="px-4 py-3">{taskItem.subject}</td>
                          <td className="px-4 py-3">{taskItem.topic}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`${statusClass} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="text-blue-400 hover:underline cursor-pointer"
                              onClick={() => handleStatusChange(taskItem._id)}
                            >
                              Change Status
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/get-task/${taskItem._id}`}
                              className="text-blue-400 hover:underline cursor-pointer"
                            >
                              <EditSquare />
                            </Link>
                            <button
                              className="ml-2 text-red-400 hover:underline cursor-pointer"
                              onClick={() => handleDelete(taskItem._id)}
                            >
                              <Delete />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="text-center text-gray-300">
                      <td colSpan="6" className="px-4 py-6">
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {task.length > 0 && (
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-300">
                  Showing {startIndex + 1} to {Math.min(endIndex, task.length)}{" "}
                  of {task.length} tasks
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
export default ViewTask;
