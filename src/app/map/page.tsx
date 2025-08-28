// 'use client'

// import Map from '../../components/map'
// import { SidebarLayout } from "@/components/sidebar-layout"
// import { motion, AnimatePresence } from 'framer-motion'

// export default function MapPage(){
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: { 
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1,
//                 delayChildren: 0.2
//             }
//         }
//     }
    
//     return (
//         <SidebarLayout>
//             <motion.div 
//                 className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
//                 initial="hidden"
//                 animate="visible"
//                 variants={containerVariants}
//             >
//                 <Map/>
//             </motion.div>
//         </SidebarLayout>
//     )
// }


"use client"

import { useEffect, useRef } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, School, Users, TrendingUp, GraduationCap, Search } from "lucide-react"
import Map from '../../components/map'
import { motion, AnimatePresence } from 'framer-motion'

export default function MapPage() {
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
                <main className=" space-y-6 p-5">
                    {/* Map Controls */}
                    <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <MapPin className="w-4 h-4" />
                            Все районы
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <Search className="w-4 h-4" />
                            Наименование школы
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <TrendingUp className="w-4 h-4" />
                            Высокий рейтинг
                        </Button>
                        {/* <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <MapPin className="w-4 h-4" />
                            Рядом со мной
                        </Button> */}
                    </motion.div>

                    {/* <motion.div className="flex flex-col" variants={itemVariants}>
                        <Card className="flex items-center gap-2 bg-green-500/30 border border-green-500">
                            <CardContent>
                                51 школ
                            </CardContent>
                        </Card>
                        <Card className="flex items-center gap-2 bg-orange-500/30 border border-orange-500">
                            <CardContent>
                                126 школ
                            </CardContent>
                        </Card>
                        <Card className="flex items-center gap-2 bg-red-500/30 border border-orange-500">
                            <CardContent>
                                65 школ
                            </CardContent>
                        </Card>
                    </motion.div> */}

                    {/* Map Container */}
                    <motion.div variants={itemVariants}>
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    Интерактивная карта
                                </CardTitle>
                                <CardDescription> Нажмите на маркеры школ для получения подробной информации</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row gap-4">
                                {/* Indicators (left side) */}
                                <motion.div className="flex flex-col gap-2 w-48" variants={itemVariants}>
                                    <Card className="flex items-center gap-2 bg-green-500/30 border border-green-500">
                                        <CardContent>51 школ</CardContent>
                                    </Card>
                                    <Card className="flex items-center gap-2 bg-orange-500/30 border border-orange-500">
                                        <CardContent>126 школ</CardContent>
                                    </Card>
                                    <Card className="flex items-center gap-2 bg-red-500/30 border border-red-500">
                                        <CardContent>65 школ</CardContent>
                                    </Card>
                                </motion.div>
                                {/* Map (right side) */}
                                <div className="flex-1">
                                    <Map className="w-full h-[600px] bg-gray-100" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </motion.div>
        </SidebarLayout>
    )
}
