import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../api/axios";

const prepareChartData = (tasks) => {
  if (!Array.isArray(tasks)) {
    return [];
  }

  let completed = 0;
  let pending = 0;

  return tasks.map((task, index) => {
    if (task.done === "completed") {
      completed++;
    } else {
      pending++;
    }

    return {
      name: `Day ${index + 1}`,
      completed,
      pending,
    };
  });
};

export default function IndexLineChart() {
  const [dayTasks, setDayTasks] = useState([]);

  useEffect(() => {
    const fetchDayTasks = async () => {
      try {
        const response = await api.get("/api/getdaytasks");

        // console.log("LineChart day tasks response:", response.data);

        const data = response.data;

        const processedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.daytasks)
            ? data.daytasks
            : Array.isArray(data?.tasks)
              ? data.tasks
              : [];

        setDayTasks(processedData);
      } catch (error) {
        console.error("Error fetching day tasks:", error);
        setDayTasks([]);
      }
    };

    fetchDayTasks();
  }, []);

  const chartData = prepareChartData(dayTasks);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name" stroke="#ccc" />

          <YAxis stroke="#ccc" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "none",
            }}
          />

          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="pending"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}