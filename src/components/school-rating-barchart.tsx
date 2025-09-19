"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts"

export default function SchoolRatingBarChart({data}: {data: { district: string; count: number; high: number; medium: number; low: number }[]}) {
  return (
    <div className="w-full h-[450px] bg-white p-2 pb-5">
      <h2 className="text-center text-lg font-semibold mb-4 text-black">Рейтинг школ по районам</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 70, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number"/>
          <YAxis type="category" dataKey="district"/>
          <Tooltip />
          <Legend
            verticalAlign="top"
            formatter={(value) => {
              if (value === "high") return "86%-100%"
              if (value === "medium") return "50%-85%"
              if (value === "low") return "5%-49%"
              return value
            }}
          />
          <Bar dataKey="high" stackId="a" fill="#22c55e">
            <LabelList dataKey="high" position="inside" fill="white" />
          </Bar>
          <Bar dataKey="medium" stackId="a" fill="#f59e0b">
            <LabelList dataKey="medium" position="inside" fill="white" />
          </Bar>
          <Bar dataKey="low" stackId="a" fill="#ef4444" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="low" position="inside" fill="white" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
