"use client"

import { useState, useEffect } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, School, Users, TrendingUp, GraduationCap, Search, FileText, Trophy, BookOpen, Target, Star, X, Building, Award, Zap, Shield } from "lucide-react"
import { motion, AnimatePresence, Variants } from 'framer-motion'
import SchoolNumberBarChart from '../../components/school-number-barchart'
import SchoolRatingBarChart from '../../components/school-rating-barchart'
import RatingTable from '../../components/rating-table'
import SchoolDetailPopup from '../../components/school-detail-popup'
import { CombinedSchool } from '../../components/rating-table';

interface DistrictData {
  district: string
  count: number
  high: number
  medium: number
  low: number
}

interface Totals {
  high: number
  medium: number
  low: number
}

interface RatingApiItem {
  district: string
  count: number
  rating?: {
    high: number
    medium: number
    low: number
  }
}

export default function RatingPage() {
    const [selectedSchool, setSelectedSchool] = useState<CombinedSchool | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
    const [selectedRating, setSelectedRating] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [data, setData] = useState<DistrictData[]>([])
    const [totals, setTotals] = useState<Totals>({ high: 0, medium: 0, low: 0,})
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

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.2 },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 },
        },
    }

    const modalVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 50,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 50,
            transition: {
            duration: 0.2
            },
        },
    };

    const districts = [
        "Алатауский район",
        "Алмалинский район",
        "Ауэзовский район",
        "Бостандыкский район",
        "Жетысуский район",
        "Медеуский район",
        "Наурызбайский район",
        "Турксибский район",
    ]

    const ratings = [
        "Высокий",
        "Средний",
        "Низкий",
    ]

    const handleRowClick = (school: CombinedSchool) => {
        setSelectedSchool(school);
        setShowModal(true);
    };

    const getRatingInfo = (rating: number | null | undefined) => {
        if (rating === null || rating === undefined) {
            return { color: "text-slate-400", bgColor: "bg-slate-100", icon: Target };
        }

        if (rating >= 86) {
            return { color: "text-emerald-600", bgColor: "bg-emerald-50", icon: Trophy }; // High
        } else if (rating >= 85) {
            return { color: "text-amber-600", bgColor: "bg-amber-50", icon: Star }; // Medium
        } else {
            return { color: "text-red-500", bgColor: "bg-red-50", icon: Target }; // Low
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch("https://admin.smartalmaty.kz/api/v1/institutions_monitoring/schools/rating-by-district/")
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`)
            }
            const result = await response.json()

            const formatted = result.map((item: RatingApiItem) => ({
                district: item.district,
                count: item.count,
                high: item.rating?.high ?? 0,
                medium: item.rating?.medium ?? 0,
                low: item.rating?.low ?? 0,
            }))

            setData(formatted)

            const sum = formatted.reduce(
                (acc: Totals, curr: DistrictData): Totals => {
                    acc.high += curr.high
                    acc.medium += curr.medium
                    acc.low += curr.low
                    return acc
                },
                { high: 0, medium: 0, low: 0 }
            )

            setTotals(sum)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(err.message)
                } else {
                    console.error("Unexpected error", err)
                }
            }
        }

        fetchData()
    }, [])


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
                                    <div className="text-2xl font-bold text-emerald-700 mb-1">{totals.high} школ</div>
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
                                    <div className="text-2xl font-bold text-amber-700 mb-1">{totals.medium} школ</div>
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
                                    <div className="text-2xl font-bold text-red-700 mb-1">{totals.low} школ</div>
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
                            </motion.div> 
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <RatingTable 
                                    onRowClick={handleRowClick} 
                                    selectedDistrict={selectedDistrict}
                                    searchQuery={searchQuery}
                                    selectedRating={selectedRating}
                                />
                            </motion.div>
                            <AnimatePresence>
                                <SchoolDetailPopup
                                    isOpen={showModal}
                                    school={selectedSchool}
                                    onClose={() => setShowModal(false)}
                                    getRatingInfo={getRatingInfo}
                                />
                            </AnimatePresence>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 h-full"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <SchoolNumberBarChart data={data}/>
                            </motion.div>
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 h-full"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <SchoolRatingBarChart data={data}/>
                            </motion.div>
                        </div>
                    </motion.div>
                    </div>
                </main>
            </SidebarLayout>
        </motion.div>
    )
}
