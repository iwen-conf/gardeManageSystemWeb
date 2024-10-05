// src/components/StudentAnalysis.tsx -- 用于成绩分析
import { Component, createSignal, createEffect, Show } from "solid-js";
import { Chart } from "./Chart";
import type { ChartData, ChartOptions } from "chart.js";

interface StudentAnalysisData {
  name: string;
  id: string;
  subjectAverages: { [subject: string]: number };
  gradesTrend: { [subject: string]: number[] };
  improvement: { [subject: string]: number };
  strongestSubject: string;
  weakestSubject: string;
  examNames: string[]; // 添加考试名称数组
}
// 定义科目映射对象
const subjectNameMap: { [key: string]: string } = {
  chinese: "语文",
  math: "数学",
  english: "英语",
  chemistry: "化学",
  physics: "物理",
  geography: "地理",
  biology: "生物",
  total: "总分",
};
// 定义颜色主题类型
type ChartColorKey = "primary" | "secondary" | "accent" | "neutral";

// 定义颜色主题
const CHART_COLORS = {
  primary: "rgba(59, 130, 246, 0.5)", // Blue
  secondary: "rgba(16, 185, 129, 0.5)", // Green
  accent: "rgba(236, 72, 153, 0.5)", // Pink
  neutral: "rgba(107, 114, 128, 0.5)", // Gray
};
// 创建一个颜色数组，便于循环使用
const CHART_COLOR_VALUES = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.neutral,
];

export const StudentAnalysis: Component<{ studentId: string }> = (props) => {
  const [analysisData, setAnalysisData] =
    createSignal<StudentAnalysisData | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal("trend");
  createEffect(() => {
    fetchStudentAnalysis(props.studentId);
  });

  const fetchStudentAnalysis = async (studentId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/student-analysis/${studentId}`
      );
      const data = await response.json();
      console.log(data);
      if (data.code === 200) {
        setAnalysisData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch student analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const emptyChartData = (): ChartData => ({
    labels: [],
    datasets: [],
  });

  // 配置图表选项
  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 750,
      easing: "easeInOutQuart",
    },
  };

  const gradesTrendChartData = (): ChartData => {
    const data = analysisData();
    if (!data) return emptyChartData();
    const subjects = Object.keys(data.gradesTrend);
    const newSubjects = subjects.filter((subject) => subject !== "total");
    const labels = data.examNames; // 使用考试名称作为标签
    return {
      labels: labels,
      datasets: Object.entries(data.gradesTrend)
        .filter(([newSubjects]) => newSubjects !== "total")
        .map(([newSubjects, scores], index) => ({
          label: subjectNameMap[newSubjects] || newSubjects,
          data: scores,
          borderColor: CHART_COLOR_VALUES[index % CHART_COLOR_VALUES.length],
          backgroundColor:
            CHART_COLOR_VALUES[index % CHART_COLOR_VALUES.length],
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        })),
    };
  };

  const subjectAveragesChartData = (): ChartData => {
    const data = analysisData();
    if (!data) return emptyChartData();
    const labels = Object.keys(data?.subjectAverages).map(
      (subject) => subjectNameMap[subject] || subject
    );
    return {
      labels: labels,
      datasets: [
        {
          label: "科目平均分",
          data: Object.values(data?.subjectAverages),
          backgroundColor: CHART_COLORS.primary,
        },
      ],
    };
  };

  const improvementsChartData = (): ChartData => {
    const data = analysisData();
    if (!data) return emptyChartData();
    const labels = data.examNames;
    const scores = data.gradesTrend["total"]; // 假设总分在gradesTrend['total']中
    return {
      labels,
      datasets: [
        {
          label: "成绩进步情况",
          data: scores,
          backgroundColor: "rgba(153, 102, 255, 0.3)", // 低饱和度亮色
        },
      ],
    };
  };

  return (
    <div class="space-y-6">
      <Show
        when={!loading()}
        fallback={
          <div class="flex items-center justify-center min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <header class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {analysisData()?.name}的学习分析
              </h2>
              <p class="text-gray-500 mt-1">学号: {analysisData()?.id}</p>
            </div>
            <div class="flex gap-4">
              <button
                onClick={() => setActiveTab("trend")}
                class={`px-6 py-2.5 rounded-lg transition-all flex items-center ${
                  activeTab() === "trend"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <i class="bi bi-graph-up mr-2"></i>成绩走势
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                class={`px-6 py-2.5 rounded-lg transition-all flex items-center ${
                  activeTab() === "analysis"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <i class="bi bi-award mr-2"></i>成绩分析
              </button>
            </div>
          </div>
        </header>

        <Show when={activeTab() === "trend"}>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-6 flex items-center">
              <i class="bi bi-graph-up text-blue-500 mr-2"></i>各科成绩走势
            </h3>
            <div class="h-[400px]">
              <Chart
                type="line"
                data={gradesTrendChartData()}
                options={chartOptions}
              />
            </div>
          </div>
        </Show>

        <Show when={activeTab() === "analysis"}>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-6 flex items-center">
                <i class="bi bi-book text-green-500 mr-2"></i>科目平均分析
              </h3>
              <div class="h-[300px]">
                <Chart
                  type="bar"
                  data={subjectAveragesChartData()}
                  options={chartOptions}
                />
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-6 flex items-center">
                <i class="bi bi-trophy text-pink-500 mr-2"></i>进步情况分析
              </h3>
              <div class="h-[300px]">
                <Chart
                  type="line"
                  data={improvementsChartData()}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
};
