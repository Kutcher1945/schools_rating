"use client"

import { useState, useEffect } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, School, Users, TrendingUp, GraduationCap, Search, FileText, Trophy, BookOpen, BarChart3, Award, Tags, Calendar} from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import SchoolNumberBarChart from '../../components/school-number-barchart'
// import SchoolRatingBarChart from '../../components/school-rating-barchart'
import LineChartYear from '../../components/line-chart-year'
import RatingTable from '../../components/rating-table'
import MapForecast from '../../components/map-forecast'

export default function DeficitPage() {
    const [currentPage, setCurrentPage] = useState('main') // 'main' | 'forecast' | 'recommendations'
    const [schoolsData, setSchoolsData] = useState([])
    const [balanceData, setBalanceData] = useState([])
    const [districtsData, setDistrictsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        district: 'Все районы',
        searchSchool: '',
        categories: { gov: true, comfort: true, private: true },
        year: 2024
    })

    const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
    const [selectedYear, setSelectedYear] = useState<string>("2024")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
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

    const years = [
        "2024",
        "2025",
        "2026",
        "2027",
        "2028",
        "2029",
        "2030",
    ]
    
    const categories = [
        "Государственные",
        "Комфортные",
        "Частные",
    ]

    const ratings = [
        "Высокий",
        "Средний",
        "Низкий",
    ]

    useEffect(() => {
        const loadData = async () => {
        try {
            // Школы
            const schoolsResponse = await fetch('https://admin.smartalmaty.kz/api/v1/institutions_monitoring/schools-enriched/?limit=10000')
            const schoolsJson = await schoolsResponse.json()
            setSchoolsData(schoolsJson.features || [])

            // Баланс/прогноз
            // const balanceResponse = await fetch('/data/balance_enriched.geojson')
            const balanceResponse = await fetch('https://admin.smartalmaty.kz/api/v1/institutions_monitoring/balance-enriched/?limit=10000')
            const balanceJson = await balanceResponse.json()
            setBalanceData(balanceJson.features || [])

            // Районы
            const districtsResponse = await fetch('/data/almaty_gdf.geojson')
            const districtsJson = await districtsResponse.json()
            setDistrictsData(districtsJson.features || [])
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
        } finally {
            setLoading(false)
        }
        }

        loadData()
    }, [])

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
        )
    }

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
                                <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-lg shadow-md ">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Прогноз дефицита школьных мест</h1>
                                    <p className="text-sm text-slate-600">Аналитика и прогноз по загруженности школ</p>
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
                        {/* Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-center justify-between text-center">
                            <motion.div 
                                className="p-4 border rounded-lg border border-red-300 bg-red-100 shadow-sm"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <p className="text-black">
                                    Дефицит (кол-во школ)
                                </p>
                                <div className="text-2xl font-bold text-red-600">
                                    0
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Гос. школы с нехваткой мест
                                </p>
                            </motion.div>

                            <motion.div 
                                className="p-4 border rounded-lg border border-red-300 bg-red-100 shadow-sm"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <p className="text-black">
                                    Профицит (кол-во школ)
                                </p>
                                <div className="text-2xl font-bold text-red-600">
                                    0
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Гос. школы с избытком мест
                                </p>
                            </motion.div>

                            <motion.div 
                                className="p-4 border rounded-lg border border-red-300 bg-red-100 shadow-sm"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <p className="text-black">
                                    Сумма дефицита (мест)
                                </p>  
                                <div className="text-2xl font-bold text-red-600">
                                    0
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Общий недостаток мест
                                </p>
                            </motion.div>

                            <motion.div 
                                className="p-4 border rounded-lg border border-red-300 bg-red-100 shadow-sm"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <p className="text-black">
                                    Сумма профицита (мест)
                                </p>
                                <div className="text-2xl font-bold text-red-600">
                                    0
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Общий избыток мест
                                </p>
                            </motion.div>

                        </div>
                        {/* Filters */}
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
                                    <div className="grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-2 items-center justify-between gap-8"> 
                                        <div className="w-full space-y-2">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Район</label>
                                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                            <SelectTrigger className="w-full h-12 items-center bg-white hover:bg-slate-50 border-slate-300 text-gray-700">
                                                {/* <div className="flex items-center gap-3 text-black"> */}
                                                    <MapPin className="w-4 h-4 text-slate-500" />
                                                    <SelectValue placeholder="Все районы" />
                                                {/* </div> */}
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem className="text-black hover:bg-gray-200" value="all">Все районы</SelectItem>
                                                {districts.map((district) => (
                                                <SelectItem key={district} value={district} className="text-black hover:bg-gray-200">
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
                                            <div className="relative items-center">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    type="text"
                                                    placeholder="Наименование школы"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-8 text-gray-800 bg-white border border-gray-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full space-y-2">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Рейтинг школ</label>
                                            <Select value={selectedRating} onValueChange={setSelectedRating}>
                                            <SelectTrigger className="w-full h-12 bg-white hover:bg-slate-50 border-slate-300 text-gray-700">
                                                {/* <div className="flex items-center gap-3 text-black"> */}
                                                    <Award className="w-4 h-4 text-slate-500" />
                                                    <SelectValue placeholder="Все рейтинги" />
                                                {/* </div> */}
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem className="text-black hover:bg-gray-200" value="all">Все рейтинги</SelectItem>
                                                {ratings.map((rating) => (
                                                <SelectItem key={rating} value={rating} className="text-black hover:bg-gray-200">
                                                    {rating}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-full space-y-2">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                Категории
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full bg-white hover:bg-slate-50 border-slate-300 justify-start"
                                                    >
                                                        <div className="flex items-center gap-3 text-gray-700 truncate">
                                                        <Tags className="w-4 h-4 text-slate-500" />
                                                        {selectedCategories.length > 0
                                                            // ? selectedCategories.join("\n")
                                                            ? selectedCategories.join(", ")
                                                            : "Все категории"}
                                                        </div>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[250px] max-h-64 overflow-y-auto bg-white shadow-md rounded-xl p-2">
                                                    <div className="flex flex-col space-y-2">
                                                        {categories.map((category) => (
                                                        <label
                                                            key={category}
                                                            className="flex items-center space-x-2 cursor-pointer"
                                                        >
                                                            <Checkbox
                                                                checked={selectedCategories.includes(category)}
                                                                onCheckedChange={() => toggleCategory(category)}
                                                            />
                                                                <span className="text-sm text-black">{category}</span>
                                                        </label>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="w-full space-y-2">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Год</label>
                                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                                <SelectTrigger className="w-full h-12 bg-white hover:bg-slate-50 border-slate-300 text-gray-700">
                                                        <Calendar className="w-4 h-4 text-slate-500" />
                                                        <SelectValue placeholder="2024" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {years.map((year) => (
                                                        <SelectItem key={year} value={year} className="text-black hover:bg-gray-200">
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div> 
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
                            <motion.div 
                                className="bg-white rounded-xl shadow-sm border border-slate-200 h-full"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                {/* <MapForecast
                                    balanceData={balanceData}
                                    schoolsData={schoolsData}
                                    filters={{
                                        district: selectedDistrict === "all" ? "Все районы" : selectedDistrict,
                                        searchSchool: searchQuery,
                                        categories: {
                                        gov: selectedCategories.length === 0 || selectedCategories.includes("Государственные"),
                                        comfort: selectedCategories.length === 0 || selectedCategories.includes("Комфортные"),
                                        private: selectedCategories.length === 0 || selectedCategories.includes("Частные"),
                                        },
                                        year: Number(selectedYear),
                                    }}
                                    districtsData={districtsData}
                                /> */}
                            </motion.div>
                            <motion.div 
                                className="bg-white rounded-xl text-black shadow-sm border border-slate-200"
                                variants={itemVariants}
                                whileHover={cardHoverVariants.hover}
                            >
                                <LineChartYear
                                    balanceData={balanceData}
                                    filters={filters}
                                    schoolsData={schoolsData}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                    </div>
                </main>
            </SidebarLayout>
        </motion.div>
    )
}
