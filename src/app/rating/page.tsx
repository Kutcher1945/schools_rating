"use client"

import { useState } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, School, Users, TrendingUp, GraduationCap, Search, FileText, Trophy, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import SchoolNumberBarChart from '../../components/school-number-barchart'
import SchoolRatingBarChart from '../../components/school-rating-barchart'
import RatingTable from '../../components/rating-table'

export default function RatingPage() {
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
    const [selectedRating, setSelectedRating] = useState<string>("all")
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

    const cardHoverVariants = {
        hover: { 
        scale: 1.02,
        boxShadow: "0 10px 25px -12px rgba(0, 0, 0, 0.25)",
        transition: {
            duration: 0.2,
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

    const ratings = [
        "Высокий",
        "Средний",
        "Низкий",
    ]

    return (
        <motion.div 
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <SidebarLayout>
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
                <main className="py-4 px-4 sm:px-6 lg:px-8">
                    <div className="py-0">
                    <motion.div 
                        // className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8"
                        className="p-6 mb-8"
                        variants={containerVariants}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-0">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-emerald-800 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Высокий рейтинг
                                        </CardTitle>
                                        <div className="p-2 bg-emerald-200 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-emerald-700" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-emerald-700 mb-1">51 школ</div>
                                    <p className="text-emerald-600 text-sm">Отличные показатели</p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-0">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-amber-800 flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Средний рейтинг
                                        </CardTitle>
                                        <div className="p-2 bg-amber-200 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-amber-700" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-amber-700 mb-1">126 школ</div>
                                    <p className="text-amber-600 text-sm">Хорошие показатели</p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb- 0">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-red-800 flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Низкий рейтинг
                                        </CardTitle>
                                        <div className="p-2 bg-red-200 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-red-700" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-700 mb-1">65 школ</div>
                                    <p className="text-red-600 text-sm">Требуют внимания</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1 mb-8">
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col gap-6 p-6"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            > 
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="space-y-3"
                                >
                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Фильтры</h3>
                                    <div className="flex items-center justify-between gap-8">

                                   
                                    <div className="w-full space-y-2">
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
                                    <div className="w-full space-y-2">
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
                                            className="w-full  pl-10 text-gray-800 bg-white hover:bg-slate-50 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                        </div>
                                    </div>
                                    <div className="w-full space-y-2">
                                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Рейтинг школ</label>
                                        <Select value={selectedRating} onValueChange={setSelectedRating}>
                                        <SelectTrigger className="w-full h-12 bg-white hover:bg-slate-50 border-slate-300">
                                            <div className="flex items-center gap-3 text-black">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                                <SelectValue placeholder="Все рейтинги" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="text-black bg-gray-100">
                                            <SelectItem value="all">Все рейтинги</SelectItem>
                                            {ratings.map((rating) => (
                                            <SelectItem key={rating} value={rating} className="text-black">
                                                {rating}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    </div>
                                    </div>
                                </motion.div>

                                {/* <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="space-y-4"
                                >
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
                                </motion.div> */}
                            </motion.div> 
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <RatingTable/>
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 h-full"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <SchoolNumberBarChart/>
                            </motion.div>
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 h-full"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <SchoolRatingBarChart/>
                            </motion.div>
                        </div>
                    </motion.div>
                    </div>
                </main>
            </SidebarLayout>
        </motion.div>
    )
}
