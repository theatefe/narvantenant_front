import React from "react";
import ReactECharts from "echarts-for-react";
// helper ***********************************
import { jalaliDate } from "../../helpers/convertDate.helper";

const RecordLineChart = ({ seriesData }) => {
  if (!seriesData || seriesData.length === 0) {
    return <div className="text-center text-gray-500 py-4">رکوردی یافت نشد</div>;
  }

  const timeToSeconds = (str) => {
    if (!str) return 0;
    const [h, m, s] = str.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };
  const secondsToTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const option = {
    backgroundColor: "#ffffff",
    grid: { left: "8%", right: "8%", bottom: "10%", top: "10%" },

    tooltip: {
      trigger: "item",
      formatter: (p) => {
        const item = p.data.original;
        return `
          <strong>${p.seriesName}</strong><br/>
          رکورد: ${item.record}<br/>
          ثبت: ${jalaliDate(item.createdAt)}
        `;
      },
    },

    xAxis: {
      type: "category",
      axisLabel: { color: "#313131" },
      data: [], // اینجا بعداً مقداردهی می‌شود
    },

    yAxis: {
      type: "value",
      name: "زمان(ثانیه)",
      nameLocation: "end",
      nameGap: 40,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#505050",
      },
      axisLabel: {
        color: "#313131",
        formatter: (value) => secondsToTime(value),
      },
    },

    series: seriesData.map((serie, i) => ({
      name: serie.name,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 10,

      data: serie.data.map((item) => ({
        value: timeToSeconds(item.record),
        original: item, // برای tooltip
      })),

      lineStyle: { width: 6 },
    })),
  };

  const firstNonEmpty = seriesData.find((s) => s.data.length > 0);
  if (firstNonEmpty) {
    option.xAxis.data = firstNonEmpty.data.map((r, key) => key + 1);
  }

  return (
    <ReactECharts option={option} style={{ width: "100%", height: "500px" }} />
  );
};

export default RecordLineChart;
