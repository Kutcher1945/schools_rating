"use client"

import { useState } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, School, Users, TrendingUp, GraduationCap, Search, FileText, Trophy } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import SchoolNumberBarChart from '../../components/school-number-barchart'
import SchoolRatingBarChart from '../../components/school-rating-barchart'
import RatingTable from '../../components/rating-table'

export default function RatingPage() {
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
                                <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-lg shadow-md ">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Рейтинг школ</h1>
                                    <p className="text-sm text-slate-600">Рейтинг образовательных учреждений г. Алматы</p>
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
                        <CardContent className="p-6">
                            <div className="flex gap-6 min-h-screen">
                            {/* Left Sidebar - Controls and Indicators */}
                                <div className="flex flex-col gap-6 w-64 flex-shrink-0">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Фильтры</h3>
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


                                <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 h-full overflow-hidden w-1/3">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                                        <div className="flex items-center p-2 text-lg">
                                            <h3 className="text-black">Общий рейтинг школ</h3>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <SchoolNumberBarChart/>
                                    </div>
                                    <div className="p-2">
                                        <SchoolRatingBarChart/>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 h-full overflow-hidden w-full">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                                        <div className="flex items-center p-2 text-lg">
                                            <h3 className="text-black">Таблица рейтингов всех показателей</h3>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <RatingTable/>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </motion.div>
        </SidebarLayout>
    )
}
