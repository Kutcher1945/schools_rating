"use client"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LabelList, 
  ResponsiveContainer 
} from "recharts"

export default function SchoolNumberBarChart({data}: {data: { district: string; count: number; high:number; medium:number; low:number}[]}) {
  return (
    <div className="w-full h-[450px] p-2 pb-5">
      <h2 className="text-center text-lg font-semibold mb-4 text-black">Количество школ по районам</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 70, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number"/>
          <YAxis type="category" dataKey="district"  />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="count" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
