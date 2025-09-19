// components/rating-table.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface SchoolApiItem {
  id: number;
  name_of_the_organization: string;
  district: string;
  gis_rating: number | null;
}

interface AnalyzeItem {
  id: number;
  academic_results_rating: number;
  pedagogical_potential_rating: number;
  safety_climate_rating: number;
  infrastructure_rating: number;
  graduate_success_rating: number;
  penalty_rating: number;
  digital_rating: number;
}

export type CombinedSchool = SchoolApiItem & Partial<Omit<AnalyzeItem, 'id'>>;

interface RatingTableProps {
  onRowClick: (school: CombinedSchool) => void;
  selectedDistrict?: string;
  searchQuery?: string;
  selectedRating?: string;
}

export default function RatingTable({ onRowClick, selectedDistrict, searchQuery, selectedRating }: RatingTableProps) {
  const [schools, setSchools] = useState<CombinedSchool[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; 

  useEffect(() => {
    const districtFilter = !selectedDistrict || selectedDistrict === "all" ? "" : selectedDistrict
    // const ratingFilter = !selectedRating || selectedRating === "all" ? "" : selectedRating.toLowerCase();
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;

        const [res1, res2] = await Promise.all([
          fetch(
            `https://admin.smartalmaty.kz/api/v1/institutions_monitoring/schools/?limit=${itemsPerPage}&offset=${offset}&district=${districtFilter}&search=${searchQuery}`
          ),
          fetch(
            `https://admin.smartalmaty.kz/api/v1/institutions_monitoring/schools/analyze/?limit=${itemsPerPage}&offset=${offset}&district=${districtFilter}`
          ),
        ]);

        const data1 = await res1.json();
        const data2 = await res2.json();

        const analyzeMap = new Map<number, AnalyzeItem>();
        data2.results.forEach((a: AnalyzeItem) => analyzeMap.set(a.id, a));

        const merged: CombinedSchool[] = data1.results.map((s: SchoolApiItem) => ({
          ...s,
          ...(analyzeMap.get(s.id) ?? {}),
        }));

        setSchools(merged);
        setTotalCount(data1.count);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    };

    fetchData();
  }, [currentPage, selectedDistrict, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const getColoredRating = (rating: number | null) => {
    if (rating === null || rating === undefined) return '—';
    if (rating >= 4.5) return <span className="bg-green-400 font-semibold px-2 py-1 rounded-md">{rating}</span>;
    if (rating >= 3.0) return <span className="bg-yellow-400 font-semibold px-2 py-1 rounded-md">{rating}</span>;
    return <span className="bg-red-400 font-semibold px-2 py-1 rounded-md">{rating}</span>;
  }

  const getColoredPercentage = (value?: number) => {
    if (value === undefined || value === null) 
      return (
      <span className={`px-2 py-1 text-gray-600`}>
        -
      </span>
    );;
    
    let colorClass = 'bg-red-400'; // default: low
    if (value >= 80) colorClass = 'bg-green-400';      // excellent
    else if (value >= 50) colorClass = 'bg-yellow-400'; // medium

    return (
      <span className={`${colorClass} font-semibold px-2 py-1 rounded-md`}>
        {value.toFixed(1)}%
      </span>
    );
  };

  // Exporting current page to Excel
  const exportToExcel = () => {
    if (!schools.length) return;

    const rows = schools.map((s) => ({
      Наименование: s.name_of_the_organization,
      Район: s.district,
      'Рейтинг GIS': s.gis_rating ?? '',
      'Качество знаний': s.academic_results_rating ?? '',
      'Квалификация педагогов': s.pedagogical_potential_rating ?? '',
      Безопасность: s.safety_climate_rating ?? '',
      Оснащенность: s.infrastructure_rating ?? '',
      'Динамика результатов школы': s.graduate_success_rating ?? '',
      Штраф: s.penalty_rating ?? '',
      'Общий рейтинг': s.digital_rating ?? '',
    }));

    // Creating a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schools');

    //Writing the workbook to binary array
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Saving it using FileSaver
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `schools_page${currentPage}.xlsx`);
  };

  const exportAllToExcel = async () => {
    try {
      const allSchools: CombinedSchool[] = [];
      const itemsPerPage = 100;
      let offset = 0;

      while (true) {
        const [res1, res2] = await Promise.all([
          fetch(`https://admin.smartalmaty.kz/api/v1/institutions_monitoring/schools/?limit=${itemsPerPage}&offset=${offset}`),
          fetch(`https://admin.smartalmaty.kz/api/v1/institutions_monitoring/schools/analyze/?limit=${itemsPerPage}&offset=${offset}`)
        ]);

        const data1 = await res1.json();
        const data2 = await res2.json();

        const analyzeMap = new Map<number, AnalyzeItem>();
        data2.results.forEach((a: AnalyzeItem) => analyzeMap.set(a.id, a));

        const merged = data1.results.map((s: SchoolApiItem) => ({
          ...s,
          ...(analyzeMap.get(s.id) ?? {})
        }));

        allSchools.push(...merged);

        offset += itemsPerPage;
        if (offset >= data1.count) break;
      }

      const rows = allSchools.map((s) => ({
        Наименование: s.name_of_the_organization,
        Район: s.district,
        'Рейтинг GIS': s.gis_rating ?? '',
        'Качество знаний': s.academic_results_rating ?? '',
        'Квалификация педагогов': s.pedagogical_potential_rating ?? '',
        Безопасность: s.safety_climate_rating ?? '',
        Оснащенность: s.infrastructure_rating ?? '',
        'Динамика результатов школы': s.graduate_success_rating ?? '',
        Профилактика: s.penalty_rating ?? '',
        'Общий рейтинг': s.digital_rating ?? '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Schools');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(data, `schools_full.xlsx`);
    } catch (err) {
      console.error('Ошибка экспорта:', err);
    }
  };


  return (
    <div className="w-full">
      <div className="max-h-108 overflow-x-auto overflow-y-auto border border-slate-200 rounded-lg bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Наименование
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Айди
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Район
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Общий рейтинг
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Качество знаний
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Квалификация педагогов
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Безопасность
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Оснащенность
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Динамика результатов школы
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Профилактика нарушений
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                Рейтинг GIS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {schools.map((s) => (
              <tr 
                key={s.id} 
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(s)}
              >
                <td className="px-4 py-3 text-slate-900 font-medium">{s.name_of_the_organization}</td>
                <td className="px-4 py-3 text-slate-900 font-medium">{s.id}</td>
                <td className="px-4 py-3 text-slate-600">{s.district}</td>
                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.digital_rating)}</td>

                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.academic_results_rating)}</td>
                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.pedagogical_potential_rating)}</td>
                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.safety_climate_rating)}</td>
                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.infrastructure_rating)}</td>
                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.graduate_success_rating)}</td>
                <td className="px-4 py-3 text-center text-white">{getColoredPercentage(s.penalty_rating)}</td>
                <td className="px-4 py-3 text-center text-white text-slate-600">{getColoredRating(s.gis_rating ?? null)}</td>
              </tr>
            ))}
            {schools.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-3 text-center text-slate-500">
                  Загрузка данных…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-t-0 border-b-0 border-slate-200 rounded-b-lg">
        <div className="flex items-center text-sm text-slate-700">
          Показано {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, totalCount)} из {totalCount} школ
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  page === currentPage ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className='flex justify-end m-4 text-sm'>
        <button 
          className='bg-green-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md'
          onClick={exportAllToExcel}>
          Export to Excel
        </button>
      </div>

    </div>
  );
}
