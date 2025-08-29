'use client'
import { useState } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, FileText, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import RatingTable from "@/components/rating-table"

export default function OrganizationsPage(){
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
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md ">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Организации образования</h1>
                                {/* <p className="text-sm text-slate-600">Интерактивная карта образовательных учреждений г. Алматы</p> */}
                            </div>
                        </motion.div>
                    </div>
                </div>
                </motion.header>
                <main className="space-y-6 p-6">
                    <div className="w-64 space-y-3">
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
                    <div>
                        <RatingTable/>
                    </div>
                </main>
            </motion.div>
        </SidebarLayout>
    )
}