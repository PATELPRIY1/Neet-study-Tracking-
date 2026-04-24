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
import axios from "axios";

const prepareChartData = (tasks) => {
  let completed = 0;
  let pending = 0;

  return tasks.map((task, index) => {
    if (task.status === "completed") {
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
        const response = await axios.get(
          "http://localhost:3000/api/getdaytasks",
          { withCredentials: true },
        );
        setDayTasks(response.data);
      } catch (error) {
        console.error("Error fetching day tasks:", error);
      }
    };

    fetchDayTasks();
  }, []);

  const chartData = prepareChartData(dayTasks);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

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
