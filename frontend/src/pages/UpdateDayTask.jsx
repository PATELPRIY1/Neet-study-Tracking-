import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const UpdateDayTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    day: "",
    biology: "",
    physics: "",
    chemistry: "",
    revision: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_URL}/api/getdaytasks`,
          {
            withCredentials: true,
          },
        );
        const tasks = Array.isArray(response.data) ? response.data : [];
        const task = tasks.find((t) => t._id === id);
        if (task) {
          setFormData({
            day: task.day || "",
            biology: task.biology || "",
            physics: task.physics || "",
            chemistry: task.chemistry || "",
            revision: task.revision || "",
          });
        } else {
          Swal.fire("Error!", "Task not found.", "error");
          navigate("/view-day-task");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        Swal.fire("Error!", "Failed to load task data.", "error");
        navigate("/view-day-task");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${VITE_API_URL}/api/updatetask/${id}`, formData, {
        withCredentials: true,
      });
      Swal.fire("Success!", "Day task updated successfully.", "success");
      navigate("/view-day-by-task");
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to update task.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold leading-relaxed pb-4">
        Update Day Task
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
      {fetching ? (
        <div className="text-center py-8">
          <p className="text-gray-300">Loading task data...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 w-[40em] absolute top-[25%] left-[40%] flex flex-col gap-6 rounded-lg bg-(--bg-transparent-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
        >
          <input
            type="text"
            name="day"
            value={formData.day}
            onChange={handleChange}
            className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
            placeholder="Day (e.g., Day 1, Monday)"
            required
          />

          <input
            type="text"
            name="biology"
            value={formData.biology}
            onChange={handleChange}
            className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
            placeholder="Biology Topic"
          />

          <input
            type="text"
            name="physics"
            value={formData.physics}
            onChange={handleChange}
            className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
            placeholder="Physics Topic"
          />

          <input
            type="text"
            name="chemistry"
            value={formData.chemistry}
            onChange={handleChange}
            className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
            placeholder="Chemistry Topic"
          />

          <input
            type="text"
            name="revision"
            value={formData.revision}
            onChange={handleChange}
            className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
            placeholder="Revision Topic"
          />

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-2 text-xl font-semibold rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:scale-[95%] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Day Task"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateDayTask;
