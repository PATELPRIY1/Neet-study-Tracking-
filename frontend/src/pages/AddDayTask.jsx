import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../api/axios";


const AddDayTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    day: "",
    biology: "",
    physics: "",
    chemistry: "",
    revision: "",
  });

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
      if (!formData.day) {
        Swal.fire({
          icon: "error",
          title: "Missing Information",
          text: "Please enter a day",
        });
        setLoading(false);
        return;
      }

      await api.post("/api/createtask", formData);

      toast.success("Day task created successfully!", {
        position: "top-right",
      });

      setFormData({
        day: "",
        biology: "",
        physics: "",
        chemistry: "",
        revision: "",
      });

      setTimeout(() => {
        navigate("/view-day-by-task");
      }, 1500);
    } catch (err) {
      console.error("Error creating day task:", err);
      Swal.fire("Error!", "Failed to create day task.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold leading-relaxed pb-4">
        Add Daily Task
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
          className="py-3 px-2 text-xl font-semibold rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:scale-[95%] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Add Day Task"}
        </button>
      </form>
    </div>
  );
};

export default AddDayTask;
