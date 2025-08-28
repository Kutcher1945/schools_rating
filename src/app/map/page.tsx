"use client"

import { useEffect, useRef, useState } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, School, Users, TrendingUp, GraduationCap, Search, FileText } from "lucide-react"
import Map from '../../components/map'
import { motion, AnimatePresence } from 'framer-motion'

export default function MapPage() {
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] as const
            }
        }
    }

    const districts = [
        "Алатауский",
        "Алмалинский",
        "Ауэзовский",
        "Бостандыкский",
        "Жетысуский",
        "Медеуский",
        "Наурызбайский",
        "Турксибский",
    ]

    return (
        <SidebarLayout>
            <motion.div 
                className="min-h-screen"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <motion.header
                    className="bg-white shadow-sm border-b border-slate-200"
                    variants={itemVariants}
                >
                     <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <motion.div 
                                className="flex items-center space-x-3"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg shadow-md ">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Интерактивная карта школ</h1>
                                    <p className="text-sm text-slate-600">Интерактивная карта образовательных учреждений г. Алматы</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.header>

                {/* Main Content */}
                <main className="space-y-6 p-6">
                    {/* Map Container */}
                    <motion.div variants={itemVariants}>
                        <Card className="overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
                            {/* <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-6">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <MapPin className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    Интерактивная карта
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Нажмите на маркеры школ для получения подробной информации
                                </CardDescription>
                            </CardHeader> */}
                        <CardContent className="p-6">
                            <div className="flex gap-6 h-[700px]">
                            {/* Left Sidebar - Controls and Indicators */}
                                <div className="flex flex-col gap-6 w-64 flex-shrink-0">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Фильтры</h3>
                                        {/* <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 h-12 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-medium"
                                        >
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                            Все районы
                                        </Button> */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Район</label>
                                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                            <SelectTrigger className="w-full h-12 bg-white hover:bg-slate-50 border-slate-300">
                                                <div className="flex items-center gap-3 text-black">
                                                    <MapPin className="w-4 h-4 text-slate-500" />
                                                    <SelectValue placeholder="Все районы" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="text-black bg-gray-100">
                                                <SelectItem value="all">Все районы</SelectItem>
                                                {districts.map((district) => (
                                                <SelectItem key={district} value={district} className="text-black">
                                                    {district}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                        </div>
                                        {/* <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 h-12 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-medium"
                                        >
                                            <Search className="w-4 h-4 text-slate-500" />
                                            Наименование школы
                                        </Button> */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                            Поиск школы
                                            </label>
                                            <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                type="text"
                                                placeholder="Наименование школы"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full h-12 pl-10 text-gray-800 bg-white hover:bg-slate-50 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Рейтинг школ</h3>
                                        <motion.div className="space-y-3" variants={itemVariants}>
                                            <div className="flex items-center justify-between p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                                                    <span className="font-medium text-emerald-800">Высокий</span>
                                                </div>
                                                <span className="text-emerald-700 font-bold">51 школ</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                                                    <span className="font-medium text-amber-800">Средний</span>
                                                </div>
                                                <span className="text-amber-700 font-bold">126 школ</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                                    <span className="font-medium text-red-800">Низкий</span>
                                                </div>
                                                <span className="text-red-700 font-bold">65 школ</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Map component */}
                                <div className="flex-1 min-w-0">
                                    <div className="h-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                                    <Map className="w-full h-full" />
                                    </div>
                                </div>

                                <Card className="w-80 flex-shrink-0 bg-white rounded-xl border border-slate-200 h-full overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 pb-4">
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            Паспорт объекта
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 overflow-y-auto">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="w-2/3">
                                                    <h3 className="text-blue-700 font-semibold mb-2">Средний рейтинг школы</h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed">
                                                        Что соответствует хорошему показателю по городу Алматы
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center w-16 h-16 bg-green-200 rounded-full border border-green-300">
                                                    <p className="text-black font-bold text-lg">98%</p>
                                                </div>
                                            </div>
                                            

                                            <div className="space-y-4">
                                                <div className="border border-blue-200 space-y-3 rounded-xl p-3">
                                                    <h3 className="text-indigo-600 font-bold text-sm uppercase tracking-wider">
                                                        Основная информация
                                                    </h3>
                                                    <div>
                                                        <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-1">
                                                            Наименование школы
                                                        </p>
                                                        <p className="text-slate-800 font-medium">ГКП на ПХВ Спец лицей</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-1">Район</p>
                                                            <p className="text-slate-800">Бостандыкский район</p>
                                                        </div>

                                                        <div>
                                                            <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-1">
                                                            Год основания
                                                            </p>
                                                            <p className="text-slate-800">2017 год</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-blue-100 border border-blue-200 rounded-xl p-3">
                                                        <h3 className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-1">
                                                            Учащихся
                                                        </h3>
                                                        <p className="text-slate-800 font-bold text-lg">1,100</p>
                                                    </div>
                                                    <div className="bg-purple-100 border border-purple-200 rounded-xl p-3">
                                                        <h3 className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-1">
                                                            Мощность
                                                        </h3>
                                                        <p className="text-slate-800 font-bold text-lg">1,500</p>
                                                    </div>
                                                </div>

                                                <div className="border border-gray-200 space-y-3 rounded-xl p-3 bg-gray-100">
                                                    <h3 className="text-gray-600 font-bold text-sm uppercase tracking-wider ">
                                                        Контактная информация
                                                    </h3>
                                                    <div>
                                                        <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-1">
                                                            Директор
                                                        </p>
                                                        <h3 className="text-slate-800 text-sm font-bold">Иванов Иван Иванович</h3>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-1">
                                                        Контакты
                                                        </p>
                                                        <div className="space-y-1">
                                                            <p className="text-slate-800">проспект Абая, 90</p>
                                                            <p className="text-slate-600 font-mono">+77777777777</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </motion.div>
        </SidebarLayout>
    )
}
