"use client"

import { useState } from "react"
import { ArrowUpDown, Filter } from "lucide-react"

interface School {
  name: string
  ratings: {
    overall: number
    knowledge: number
    dynamics: number
    qualification: number
    equipment: number
    inclusion: number
    violations: number
    talents: number
  }
}

const schools: School[] = [
  {
    name: 'КГУ "Специализированный лицей №126"',
    ratings: {
      overall: 99,
      knowledge: 99,
      dynamics: 78,
      qualification: 99,
      equipment: 99,
      inclusion: 88,
      violations: 99,
      talents: 89,
    },
  },
  {
    name: 'ГКП на ПХВ "Специализированный лицей №165"',
    ratings: {
      overall: 46,
      knowledge: 88,
      dynamics: 46,
      qualification: 46,
      equipment: 46,
      inclusion: 46,
      violations: 46,
      talents: 46,
    },
  },
  // ➝ add more rows
]

function getColor(value: number): string {
  if (value >= 86) return "text-green-600 font-semibold"
  if (value >= 50) return "text-orange-500 font-semibold"
  return "text-red-500 font-semibold"
}

export default function RatingTable() {
  const [sortKey, setSortKey] = useState<keyof School["ratings"]>("overall")
  const [ascending, setAscending] = useState(true)

  const sorted = [...schools].sort((a, b) => {
    const diff = a.ratings[sortKey] - b.ratings[sortKey]
    return ascending ? diff : -diff
  })

  const toggleSort = (key: keyof School["ratings"]) => {
    if (sortKey === key) {
      setAscending(!ascending)
    } else {
      setSortKey(key)
      setAscending(true)
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-blue-300">
      <table className="min-w-full border-collapse text-sm text-center">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-2 border border-gray-300 text-left">Наименование школы</th>
            {[
              { key: "overall", label: "Общий рейтинг" },
              { key: "knowledge", label: "Качество знаний" },
              { key: "dynamics", label: "Динамика результатов" },
              { key: "qualification", label: "Квалификация педагогов" },
              { key: "equipment", label: "Оснащенность" },
              { key: "violations", label: "Профилактика нарушений" },
              { key: "talents", label: "Развитие талантов" },
              { key: "inclusion", label: "Инклюзивное образование" },
            ].map(({ key, label }) => (
              <th
                key={key}
                className="p-2 border border-gray-300 cursor-pointer select-none"
                onClick={() => toggleSort(key as keyof School["ratings"])}
              >
                <div className="flex items-center justify-center gap-1">
                  {label}
                  <ArrowUpDown className="w-4 h-4 inline" />
                </div>
              </th>
            ))}
            <th className="p-2 border border-gray-300">Паспорт</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((school, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-2 border border-gray-300 text-left">{school.name}</td>
              {Object.entries(school.ratings).map(([key, value]) => (
                <td key={key} className={`p-2 border border-gray-300 ${getColor(value)}`}>
                  {value}%
                </td>
              ))}
              <td className="p-2 border border-gray-300">
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                  ПАСПОРТ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
