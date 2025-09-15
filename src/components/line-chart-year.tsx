import { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// --- Types ---
interface Filters {
  district: string
  year: number
  searchSchool?: string
  categories?: {
    gov?: boolean
    comfort?: boolean
    private?: boolean
  }
}

interface FeatureProperties {
  [key: string]: unknown
  district?: string
  District?: string
  district_name_ru?: string
  DISTRICT?: string
  year?: number | string
  Year?: number | string
  YEAR?: number | string
  demand_public_6_17?: number
  demand_6_17?: number
  organization_name?: string
  education_type?: string
  school_type?: string
  is_private?: boolean
  is_comfort?: boolean
  is_public?: boolean
  is_any_gov?: boolean
  __normKeys?: Record<string, unknown>
}

interface Feature {
  properties: FeatureProperties
}

interface School {
  properties: FeatureProperties
}

interface LineChartYearProps {
  balanceData: Feature[]
  filters: Filters
  schoolsData: School[]
}

interface ChartData {
  year: string
  'Дети 6-17 (спрос)': number
  'Статус школ (сумма)': number
}

const LineChartYear: React.FC<LineChartYearProps> = ({
  balanceData,
  filters,
  schoolsData,
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
    const demandTotals: Record<number, number> = Object.fromEntries(
      YEARS.map(y => [y, 0])
    )

    // Explicitly define 'v' as unknown, then perform type checks
    const toNum = (v: unknown): number => {
      if (v === null || v === undefined || v === '') return 0
      if (typeof v === 'number') return Number.isFinite(v) ? v : 0
      // Ensure v is treated as a string before replace/parseFloat
      const n = parseFloat(String(v).replace(',', '.'))
      return Number.isFinite(n) ? n : 0
    }

    // ---- спрос детей 6–17 ----
    const looksLong = balanceData?.some(it => {
      const p = it?.properties || {}
      return p.year || p.Year || p.YEAR
    })

    if (looksLong) {
      balanceData.forEach(item => {
        const p = item?.properties || {}
        // Type assertion for p.year, p.Year, p.YEAR as unknown first, then to string
        const y = Number(p.year ?? p.Year ?? p.YEAR)
        if (!YEARS.includes(y)) return

        const district =
          p.district ?? p.District ?? p.district_name_ru ?? p.DISTRICT
        const matchesDistrict =
          filters.district === 'Все районы' || district === filters.district
        if (!matchesDistrict) return

        const candidates = [
          p[`demand_public_6_17_${y}`],
          p[`demand_public_6_17${y}`],
          p[`demand_6_17_${y}`],
          p[`demand_6_17${y}`],
          p.demand_public_6_17,
          p.demand_6_17,
        ]
        // val is unknown here, passed to toNum
        const val = candidates.find((v: unknown) => v !== undefined)
        demandTotals[y] += toNum(val)
      })
    } else {
      balanceData.forEach(item => {
        const p = item?.properties || {}
        const district =
          p.district ?? p.District ?? p.district_name_ru ?? p.DISTRICT
        const matchesDistrict =
          filters.district === 'Все районы' || district === filters.district
        if (!matchesDistrict) return
        YEARS.forEach(y => {
          // val is unknown here, passed to toNum
          const val =
            p[`demand_public_6_17_${y}`] ??
            p[`demand_public_6_17${y}`] ??
            p[`demand_6_17_${y}`] ??
            p[`demand_6_17${y}`] ??
            0
          demandTotals[y] += toNum(val)
        })
      })
    }

    // ---- сумма status_YYYY по школам ----
    const totalStatusByYear: Record<number, number> = Object.fromEntries(
      YEARS.map(y => [y, 0])
    )

    const getStatusValue = (props: FeatureProperties, year: number): number => {
      if (!props) return 0
      if (!props.__normKeys) {
        // Ensure that props.__normKeys is initialized correctly
        props.__normKeys = {} as Record<string, unknown>
        for (const [k, v] of Object.entries(props)) {
          const nk = String(k).toLowerCase().replace(/\s+/g, '').trim()
          props.__normKeys[nk] = v
        }
      }
      const targets = [
        `status_${year}`,
        `status${year}`,
        `status-${year}`,
        `status ${year}`,
        `status_${year} `,
        `status ${year} `,
        `status${year} `,
      ].map(k => k.toLowerCase().replace(/\s+/g, ''))

      for (const t of targets) {
        if (props.__normKeys && t in props.__normKeys) {
          return toNum(props.__normKeys[t])
        }
      }
      for (const [nk, v] of Object.entries(props.__normKeys)) {
        if (new RegExp(`^status[_-]?${year}$`, 'i').test(nk)) return toNum(v)
      }
      return 0
    }

    // фильтрация школ
    let filteredSchools = (schoolsData || []).filter(s => {
      const p = s?.properties || s || {}
      const district =
        p.district ?? p.District ?? p.district_name_ru ?? p.DISTRICT
      const matchesDistrict =
        filters.district === 'Все районы' || district === filters.district

      const matchesSearch =
        !filters.searchSchool ||
        (String(p.organization_name || '') // Ensure p.organization_name is treated as string
          .toLowerCase()
          .includes(String(filters.searchSchool).toLowerCase()))

      const et = String(p.education_type ?? p.school_type ?? '').toLowerCase()
      const isPrivate = p.is_private === true || /частн/.test(et)
      const isComfort = p.is_comfort === true || /комфорт/.test(et)
      const isGov =
        p.is_public === true ||
        p.is_any_gov === true ||
        /государствен/.test(et) ||
        (!isPrivate && !isComfort)

      return matchesDistrict && matchesSearch && (isGov || isComfort)
    })

    if (filteredSchools.length === 0 && (schoolsData || []).length) {
      console.warn(
        'LineChartYear: по выбранному району школ не найдено — беру все районы (гос+комфорт).'
      )
      filteredSchools = (schoolsData || []).filter(s => {
        const p = s?.properties || s || {}
        const et = String(p.education_type ?? p.school_type ?? '').toLowerCase()
        const isPrivate = p.is_private === true || /частн/.test(et)
        const isComfort = p.is_comfort === true || /комфорт/.test(et)
        const isGov =
          p.is_public === true ||
          p.is_any_gov === true ||
          /государствен/.test(et) ||
          (!isPrivate && !isComfort)
        return isGov || isComfort
      })
    }

    filteredSchools.forEach(s => {
      const p = s?.properties || s || {}
      YEARS.forEach(y => {
        const v = Math.abs(getStatusValue(p, y))
        if (v > 0) totalStatusByYear[y] += v
      })
    })

    console.log('Σ status by year:', totalStatusByYear)

    const data: ChartData[] = YEARS.map(y => ({
      year: String(y),
      'Дети 6-17 (спрос)': demandTotals[y],
      'Статус школ (сумма)': totalStatusByYear[y],
    }))

    setChartData(data)
  }, [balanceData, schoolsData, filters])

  const current =
    chartData.find(d => d.year === String(filters.year))?.[
      'Дети 6-17 (спрос)'
    ] ?? 0

  const yDomain: [number, number] = useMemo(() => {
    const values = chartData
      .flatMap(d => [d['Дети 6-17 (спрос)'], d['Статус школ (сумма)']])
      .filter(v => Number.isFinite(v)) as number[]
    if (!values.length) return [0, 1]
    const min = Math.min(...values)
    const max = Math.max(...values)
    const pad = Math.max(1, (max - min) * 0.05)
    return [Math.max(0, min - pad), max + pad]
  }, [chartData])

  return (
    <div className="line-chart-container rounded-lg p-4">
      <h3 className='mb-4 text-[#1e293b]'>Прогноз спроса государственных школьных мест</h3>
      <div className="chart-wrapper mb-4 w-full overflow-hidden text-xs">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              domain={yDomain}
              allowDecimals={false}
              tickCount={6}
              tickFormatter={(v: number) => v.toLocaleString('ru-RU')}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Дети 6-17 (спрос)"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Статус школ (сумма)"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="p-4 bg-[#f8fafc] rounded-lg">
        <h4 className='mb-2 text-[#1e293b] text-sm'>Спрос детей 6-17 по годам</h4>
        <div className="mb-2 text-[#4b5563] text-xs">
          <p>
            На {filters.year} год: {Number(current).toLocaleString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LineChartYear;