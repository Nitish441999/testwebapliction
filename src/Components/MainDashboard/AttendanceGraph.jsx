import React from "react";
import { Bar } from "react-chartjs-2";

const AttendanceGraph = ({ attendanceGraphData, last7Days }) => {
  return (
    <div className="w-full lg:w-1/2 p-4 shadow-md bg-white rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Attendance Graph</h2>
      </div>
      <Bar
        data={attendanceGraphData}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const date = last7Days[tooltipItem.dataIndex].fullDate;
                  const value = tooltipItem.raw;
                  return `Date: ${date}, Total: ${value}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AttendanceGraph;
