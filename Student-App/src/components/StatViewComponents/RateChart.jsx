import {
  AreaChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';

function RateChart({ curruntData }) {
  return (
    <ResponsiveContainer width="95%" height={300}>
      <AreaChart data={curruntData}>
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
          dataKey={'label'}
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        />
        {/* <Legend /> */}
        <Area
          type="natural"
          dataKey="rate"
          name="출석률 (%)"
          stroke="#00bc7d"
          strokeWidth={2}
          fill="url(#colorValue)"
          filter="url(#shadow)"
          dot={{ stroke: '#00bc7d', fill: '#ffffff', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default RateChart;
