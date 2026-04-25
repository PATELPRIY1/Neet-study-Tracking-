import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
const VITE_API_URL = import.meta.env.VITE_API_URL;
import api from "../api/axios";

const AddTask = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {
      subject: formData.get("subject"),
      topic: formData.get("topic"),
    };

    if (!taskData.subject || !taskData.topic) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all fields",
      });
      return;
    }

    api
      .post(`${VITE_API_URL}/api/create-task`, taskData)
      .then((res) => {
        navigate("/view-task");
        toast.success("Task created successfully!", {
          position: "top-right",
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Error creating task");
      });
  };

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
      <form
        onSubmit={handleSubmit}
        className="p-6 w-[40em] absolute top-[25%] left-[40%] flex flex-col gap-6 rounded-lg bg-(--bg-transparent-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
      >
        <select
          name="subject"
          className="py-3 px-2 rounded-md *:bg-gray-800 bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
        >
          <option>Select Subject</option>
          <option value="biology">Biology</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
        </select>
        <input
          type="text"
          name="topic"
          className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
          placeholder="Enter Topics"
        />
        <button className="py-3 px-2 text-xl font-semibold rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:scale-[95%]">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
