import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
require("dotenv").config();
const { VITE_API_URL } = process.env;

const UpdateTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    axios
      .get(`${VITE_API_URL}/api/get-task-by/${taskId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setSubject(res.data.task.subject);
        setTopic(res.data.task.topic);
      })
      .catch((err) => {
        console.error("Error fetching task:", err);
      });
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to update this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
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

        await axios.put(
          `${VITE_API_URL}/api/update-task/${taskId}`,
          taskData,
          {
            withCredentials: true,
          },
        );
        toast.success("Task updated successfully!", {
          position: "top-right",
        });
        navigate("/view-task");
      } catch (err) {
        console.error("Error updating task:", err);
        Swal.fire("Error!", "Failed to update the task.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold leading-relaxed pb-4">
        Update Task
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
        <select
          name="subject"
          className="py-3 px-2 rounded-md *:bg-gray-800 bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
        >
          {/* <option>Select Subject</option> */}
          <option value="biology" defaultValue={subject}>
            Biology
          </option>
          <option value="physics" defaultValue={subject}>
            Physics
          </option>
          <option value="chemistry" defaultValue={subject}>
            Chemistry
          </option>
        </select>
        <input
          type="text"
          name="topic"
          defaultValue={topic}
          className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
          placeholder="Enter Topics"
        />
        <button className="py-3 px-2 text-xl font-semibold rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:scale-[95%] ">
          Update Task
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;
