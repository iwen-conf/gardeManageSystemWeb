// components/Analysis.tsx
import { Component, createSignal, createEffect, createMemo } from "solid-js";
import { Chart } from "./Chart";
import type { GradeAnalysis } from "../types/grade";
import type { ChartData, ChartOptions } from "chart.js";

export const Analysis: Component = () => {
  const [analysisData, setAnalysisData] = createSignal<GradeAnalysis | null>(
    null
  );
  const [loading, setLoading] = createSignal(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/analysis");
      const data = await response.json();
      if (data.code === 200) {
        setAnalysisData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchAnalysis();
  });

  const averagesChartData = createMemo(() => {
    const data = analysisData();
    if (!data) return null;

    return {
      labels: Object.keys(data.subjectAverages),
      datasets: [
        {
          label: "平均分",
          data: Object.values(data.subjectAverages),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(199, 199, 199, 0.5)",
          ],
        },
      ],
    } as ChartData;
  });

  const distributionChartData = createMemo(() => {
    const data = analysisData();
    if (!data) return null;

    const subjects = Object.keys(data.subjectDistribution);
    if (subjects.length === 0) return null;

    const firstSubject = subjects[0];
    const ranges = Object.keys(data.subjectDistribution[firstSubject]);

    return {
      labels: ranges,
      datasets: subjects.map((subject, index) => ({
        label: subject,
        data: Object.values(data.subjectDistribution[subject]),
        backgroundColor: `hsla(${
          (index * 360) / subjects.length
        }, 70%, 50%, 0.5)`,
      })),
    } as ChartData;
  });

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const improvementChartData = createMemo(() => {
    const data = analysisData();
    if (!data?.improvement) return null;

    return {
      labels: Object.keys(data.improvement),
      datasets: [
        {
          label: "分数变化",
          data: Object.values(data.improvement),
          backgroundColor: Object.values(data.improvement).map((value) =>
            value >= 0 ? "rgba(75, 192, 192, 0.5)" : "rgba(255, 99, 132, 0.5)"
          ),
        },
      ],
    } as ChartData;
  });

  return (
    <div class="space-y-6">
      <h2 class="text-lg font-semibold">成绩分析</h2>

      {loading() ? (
        <div class="text-center py-4">加载中...</div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-md font-medium mb-2">各科平均分</h3>
            <div class="h-[300px]">
              {averagesChartData() && (
                <Chart
                  type="bar"
                  data={averagesChartData()!}
                  options={chartOptions}
                />
              )}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-md font-medium mb-2">分数段分布</h3>
            <div class="h-[300px]">
              {distributionChartData() && (
                <Chart
                  type="bar"
                  data={distributionChartData()!}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4 lg:col-span-2">
            <h3 class="text-md font-medium mb-2">进步情况</h3>
            <div class="h-[300px]">
              {improvementChartData() && (
                <Chart
                  type="bar"
                  data={improvementChartData()!}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: "学生成绩进步情况",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
