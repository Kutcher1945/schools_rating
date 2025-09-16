import { useState, useEffect } from 'react'

// --- Types ---
interface SchoolProperties {
  ['Unnamed: 0']: string | number
  organization_name: string
  district: string
  education_type: string
  is_private: boolean
  capacity_shifts?: number
  total_2024?: number
  forecast_total?: number
  deficit?: number
  surplus?: number
  rating?: number
  micro_district?: string
  [key: string]: unknown
}

interface School {
  properties: SchoolProperties
}

interface CategoriesFilter {
  gov: boolean
  comfort: boolean
  private: boolean
}

interface Filters {
  district: string
  searchSchool?: string
  categories: CategoriesFilter
}

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface DeficitTableProps {
  schoolsData: School[]
  filters: Filters
}

const DeficitTable: React.FC<DeficitTableProps> = ({ schoolsData, filters }) => {
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rating', direction: 'desc' })

  useEffect(() => {
    const filtered = schoolsData.filter((school) => {
      const matchesDistrict =
        filters.district === 'Все районы' || school.properties.district === filters.district

      const matchesSearch =
        !filters.searchSchool ||
        school.properties.organization_name
          .toLowerCase()
          .includes(filters.searchSchool.toLowerCase())

      const isGov = !school.properties.is_private
      const isComfort = school.properties.education_type === 'комфортная школа'
      const isPrivate = school.properties.is_private

      const matchesCategories =
        (filters.categories.gov && isGov) ||
        (filters.categories.comfort && isComfort) ||
        (filters.categories.private && isPrivate)

      return matchesDistrict && matchesSearch && matchesCategories
    })

    const sorted = [...filtered].sort((a, b) => sortData(a, b, sortConfig.key))
    setFilteredSchools(sorted)
  }, [schoolsData, filters, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortData = (a: School, b: School, key: string): number => {
    let aValue = a.properties[key] ?? 0
    let bValue = b.properties[key] ?? 0

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    return sortConfig.direction === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
  }

  const getSchoolType = (school: School): string => {
    if (school.properties.is_private) return 'Частная'
    if (school.properties.education_type === 'комфортная школа') return 'Комфортная'
    return 'Государственная'
  }

  const getSchoolTypeColor = (school: School): string => {
    if (school.properties.is_private) return '#3B82F6'
    if (school.properties.education_type === 'комфортная школа') return '#F59E0B'
    return '#10B981'
  }

  return (
    <div className="p-4 rounded-sm h-[500px]">
      <h3 className="text-[#1e293b]">Список школ</h3>
      <div className="h-full overflow-x-auto overflow-y-auto">
        <table className="w-full h-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              <th 
                onClick={() => handleSort('organization_name')}
                className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100"
                >
                Название школы
                {sortConfig.key === 'organization_name' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('district')}
                className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">
                Район
                {sortConfig.key === 'district' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('education_type')}
                className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">
                Категории школ
                {sortConfig.key === 'education_type' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('capacity_shifts')}
                className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">
                Вместимость
                {sortConfig.key === 'capacity_shifts' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">Кол-во детей 2024</th>
              <th className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100 text-justify">Кол-во детей 2025</th>
              <th className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">Дефицит</th>
              <th className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">Профицит</th>
              <th onClick={() => handleSort('rating')}
                className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">
                    <div className='flex items-center'>
                      Рейтинг 
                      {sortConfig.key === 'rating' && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </div>
              </th>
              <th className="bg-slate-50 px-3 py-3 text-left font-semibold text-gray-700 border-b border-slate-200 
                   cursor-pointer select-none hover:bg-slate-100">Адрес</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.slice(0, 20).map((school) => (
              <tr 
                key={school.properties['Unnamed: 0']}
                className='className="hover:bg-slate-50"'>
                {/* <td className="school-name">{school.properties.organization_name}</td> */}
                <td className="px-3 py-3 border-b border-slate-100 text-gray-800">{school.properties.organization_name}</td>
                <td className="text-[#4b5563]">{school.properties.district}</td>
                <td >
                  <span
                    className="px-2 py-1 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: getSchoolTypeColor(school) }}
                  >
                    {getSchoolType(school)}
                  </span>
                </td>
                <td className="text-[#4b5563]">{school.properties.capacity_shifts ?? 'Н/Д'}</td>
                <td className="text-[#4b5563]">{school.properties.total_2024 ?? 'Н/Д'}</td>
                <td className="text-[#4b5563]">{school.properties.forecast_total ?? 'Н/Д'}</td>
                <td className={school.properties.deficit && school.properties.deficit > 0 ? 'text-[#ef4444] font-medium' : 'text-[#4b5563]'}>
                  {school.properties.deficit ?? '0'}
                </td>
                <td className={school.properties.surplus && school.properties.surplus > 0 ? 'text-[#10b981] font-medium' : 'text-[#4b5563]'}>
                  {school.properties.surplus ?? '0'}
                </td>
                <td className="font-medium">⭐ {school.properties.rating ?? 'Н/Д'}</td>
                <td className="text-[#4b5563] text-[0.8rem]">{school.properties.micro_district}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSchools.length > 20 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>Показано 20 из {filteredSchools.length} школ</p>
        </div>
      )}
    </div>
  )
}

export default DeficitTable
