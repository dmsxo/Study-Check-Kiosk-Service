import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import {
  prevMonth,
  nextMonth,
  prevYear,
  nextYear,
} from "../../helpers/calendar.helper";
import CalendarHeader from "./../UIComponents/CalendarHeader";
import { getRateByMonth, getRateByWeek } from "../../helpers/stats.helper";

function displayText(viewMode, curruntView) {
  const year = curruntView.getFullYear();
  const month = curruntView.getMonth() + 1;
  if (viewMode === "month") {
    return `${year}년`;
  } else if (viewMode === "week") {
    return `${year}년 ${month}월`;
  }
}

function prev(viewMode, setCurruntView) {
  if (viewMode === "month") {
    prevYear(setCurruntView);
  } else if (viewMode === "week") {
    prevMonth(setCurruntView);
  }
}

function next(viewMode, setCurruntView) {
  if (viewMode === "month") {
    nextYear(setCurruntView);
  } else if (viewMode === "week") {
    nextMonth(setCurruntView);
  }
}

const currentData = [
  { label: "3월", rate: 92 },
  { label: "4월", rate: 87 },
  { label: "5월", rate: 90 },
  { label: "6월", rate: 89 },
  { label: "7월", rate: 91 },
  { label: "8월", rate: 70 },
  { label: "9월", rate: 93 },
  { label: "10월", rate: 94 },
  { label: "11월", rate: 80 },
  { label: "12월", rate: 100 },
];

function getRateData(stats, viewMode, curruntView) {
  if (viewMode === "month") {
    return getRateByMonth(stats, curruntView);
  } else if (viewMode === "week") {
    return getRateByWeek(stats, curruntView);
  }
}

function RateChart({
  viewMode,
  setViewMode,
  curruntView,
  setCurruntView,
  stats,
}) {
  return (
    <>
      <CalendarHeader
        text={displayText(viewMode, curruntView)}
        prev={() => prev(viewMode, setCurruntView)}
        next={() => next(viewMode, setCurruntView)}
      />
      <ResponsiveContainer width="100%" height="70%">
        <AreaChart
          data={getRateData(stats, viewMode, curruntView)}
          margin={{ top: 5, right: 25, bottom: 5, left: -25 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5ee9b5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#5ee9b5" stopOpacity={0.05} />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="8"
                floodOpacity="0.15"
                floodColor="#5ee9b5"
              />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={"label"}
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            name="출석률 (%)"
            stroke="#00bc7d"
            strokeWidth={2}
            fill="url(#colorValue)"
            filter="url(#shadow)"
            dot={{ stroke: "#00bc7d", fill: "#ffffff", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

export default RateChart;
