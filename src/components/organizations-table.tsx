// components/rating-table.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SchoolData {
  id: number;
  name: string;
  district: string;
  address: string;
  type: string;
  indicator1: number;
  indicator2: number;
  indicator3: number;
  indicator4: number;
  overallRating: 'high' | 'medium' | 'low';
  head_teacher: string;
}

const mockData: SchoolData[] = [
  {
    id: 1,
    name: 'СШОД № 1',
    district: 'Алатауский район',
    address: 'проспект Абая',
    type: "общ. школа",
    indicator1: 46,
    indicator2: 88,
    indicator3: 46,
    indicator4: 46,
    overallRating: 'medium',
    head_teacher: "Иванова Зинаида Петровна"
  },
  {
    id: 2,
    name: 'Гимназия № 25',
    district: 'Алатауский район',
    address: 'проспект Абая',
    type: "общ. школа",
    indicator1: 99,
    indicator2: 99,
    indicator3: 78,
    indicator4: 99,
    overallRating: 'high',
    head_teacher: "Иванова Зинаида Петровна"
  },
  {
    id: 3,
    name: 'СШОД № 3',
    district: 'Алатауский район',
    address: 'проспект Абая',
    type: "общ. школа",
    indicator1: 72,
    indicator2: 65,
    indicator3: 54,
    indicator4: 88,
    overallRating: 'medium',
    head_teacher: "Иванова Зинаида Петровна"
  },
  {
    id: 4,
    name: 'Лицей № 12',
    district: 'Алмалинский район',
    address: 'проспект Абая',
    type: "общ. школа",
    indicator1: 91,
    indicator2: 94,
    indicator3: 89,
    indicator4: 92,
    overallRating: 'high',
    head_teacher: "Иванова Зинаида Петровна"
  },
  {
    id: 5,
    name: 'СШОД № 15',
    district: 'Алмалинский район',
    address: 'проспект Абая',
    type: "общ. школа",
    indicator1: 34,
    indicator2: 52,
    indicator3: 28,
    indicator4: 41,
    overallRating: 'low',
    head_teacher: "Иванова Зинаида Петровна"
  },
];

const getPercentageColor = (value: number) => {
  if (value >= 80) return 'text-green-600 bg-green-50';
  if (value >= 50) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

const getRatingBadge = (rating: 'high' | 'medium' | 'low') => {
  switch (rating) {
    case 'high':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'medium':
      return 'bg-orange-100 text-orange-800 border border-orange-200';
    case 'low':
      return 'bg-red-100 text-red-800 border border-red-200';
  }
};

const getRatingText = (rating: 'high' | 'medium' | 'low') => {
  switch (rating) {
    case 'high': return 'Высокий';
    case 'medium': return 'Средний';
    case 'low': return 'Низкий';
  }
};

export default function OrganizationsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
        <table className="text-sm w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Наименование
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Район
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Адрес
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Виды организаций образования
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Форма собственности
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Ведомственная принадлежность 
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Количество обучающихся
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Проектная мощность
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Год подстройки
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                ФИО Директора
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentData.map((school, index) => (
              <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-900 font-medium">
                  {school.id}
                </td>
                <td className="px-4 py-3 text-slate-900 font-medium">
                  {school.name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {school.district}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {school.address}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(school.indicator1)}`}>
                    {school.indicator1}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(school.indicator2)}`}>
                    {school.indicator2}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(school.indicator3)}`}>
                    {school.indicator3}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(school.indicator4)}`}>
                    {school.indicator4}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getRatingBadge(school.overallRating)}`}>
                    {getRatingText(school.overallRating)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(school.indicator4)}`}>
                    {school.indicator4}%
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {school.head_teacher}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-t-0 border-slate-200 rounded-b-lg">
        <div className="flex items-center text-sm text-slate-700">
          Показано {startIndex + 1}-{Math.min(endIndex, mockData.length)} из {mockData.length} школ
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}