// components/GradeChart.tsx
import { Component, createMemo } from "solid-js";
import { Chart } from "./Chart";
import type { Student } from "../types/grade";

interface GradeChartProps {
  student: Student | null;
}

export const GradeChart: Component<GradeChartProps> = (props) => {
  const chartData = createMemo(() => ({
    labels: ["语文", "数学", "英语", "化学", "物理", "地理", "生物"],
    datasets: [
      {
        label: props.student?.name || "",
        data: props.student
          ? [
              props.student.chinese,
              props.student.math,
              props.student.english,
              props.student.chemistry,
              props.student.physics,
              props.student.geography,
              props.student.biology,
            ]
          : [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "学生成绩分布",
      },
    },
  };

  return (
    <div class="h-[400px]">
      <h2 class="text-lg font-semibold mb-4">成绩趋势</h2>
      {props.student ? (
        <Chart type="line" data={chartData()} options={chartOptions} />
      ) : (
        <div class="flex items-center justify-center h-full text-gray-500">
          请选择学生查看成绩
        </div>
      )}
    </div>
  );
};
