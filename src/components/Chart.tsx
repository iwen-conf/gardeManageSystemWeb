// src/components/Chart.tsx -- 图表组件
import { Component, onMount, onCleanup, createEffect } from "solid-js";
import { Chart as ChartJS } from "chart.js/auto";
import { ChartProps } from "../types/chart";

export const Chart: Component<ChartProps> = (props) => {
  let chartInstance: ChartJS | null = null;
  let canvasRef: HTMLCanvasElement | undefined;

  const destroyChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  };

  const createOrUpdateChart = () => {
    if (!canvasRef) return;

    // If chart exists, destroy it first
    destroyChart();

    // Create new chart instance
    chartInstance = new ChartJS(canvasRef, {
      type: props.type,
      data: props.data,
      options: props.options,
    });
  };

  // Watch for data changes
  createEffect(() => {
    // Access props to track changes
    props.data;
    props.type;
    props.options;

    if (chartInstance) {
      createOrUpdateChart();
    }
  });

  onMount(() => {
    createOrUpdateChart();
  });

  onCleanup(() => {
    destroyChart();
  });

  return <canvas ref={canvasRef} />;
};
