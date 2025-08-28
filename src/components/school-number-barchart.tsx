"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from "recharts"

const data = [
  { district: "Турксибский", schools: 55 },
  { district: "Бостандыкский", schools: 40 },
  { district: "Наурызбайский", schools: 37 },
  { district: "Жетысуский", schools: 36 },
  { district: "Алмалинский", schools: 25 },
  { district: "Ауэзовский", schools: 19 },
  { district: "Медеуский", schools: 13 },
  { district: "Алатауский", schools: 10 },
]

export default function SchoolNumberBarChart() {
  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-2xl shadow">
      <h2 className="text-center text-lg font-semibold mb-4 text-black">Количество школ по районам</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 70, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number"/>
          <YAxis type="category" dataKey="district"  />
          <Tooltip />
          <Bar dataKey="schools" fill="#2563eb" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="schools" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
