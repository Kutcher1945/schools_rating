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

const data = [
  { district: "Турксибский", green: 6, orange: 33, red: 16, total: 55 },
  { district: "Бостандыкский", green: 12, orange: 25, red: 3, total: 40 },
  { district: "Наурызбайский", green: 3, orange: 23, red: 11, total: 37 },
  { district: "Жетысуский", green: 0, orange: 9, red: 25, total: 36 },
  { district: "Алмалинский", green: 5, orange: 17, red: 3, total: 25 },
  { district: "Ауэзовский", green: 8, orange: 11, red: 0, total: 19 },
  { district: "Медеуский", green: 5, orange: 0, red: 6, total: 13 },
  { district: "Алатауский", green: 3, orange: 6, red: 0, total: 10 },
]

export default function SchoolRatingBarChart() {
  return (
    <div className="w-full h-[450px] bg-white p-4 rounded-2xl shadow">
      <h2 className="text-center text-lg font-semibold mb-4 text-black">Прогноз дефицита школьных мест</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 70, bottom: 20 }}
          barCategoryGap="10%"   // уменьшает/увеличивает расстояние между барами
          barSize={50}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number"/>
          <YAxis type="category" dataKey="district"/>
          <Tooltip />
          <Legend
            verticalAlign="top"
            formatter={(value) => {
              if (value === "green") return "86%-100%"
              if (value === "orange") return "50%-85%"
              if (value === "red") return "5%-49%"
              return value
            }}
          />
          <Bar dataKey="green" stackId="a" fill="#22c55e">
            <LabelList dataKey="green" position="inside" fill="white" />
          </Bar>
          <Bar dataKey="orange" stackId="a" fill="#f59e0b">
            <LabelList dataKey="orange" position="inside" fill="white" />
          </Bar>
          <Bar dataKey="red" stackId="a" fill="#ef4444">
            <LabelList dataKey="red" position="inside" fill="white" />
          </Bar>
          {/* total values on the right */}
          <Bar dataKey="total" fill="transparent" >
            <LabelList dataKey="total" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
