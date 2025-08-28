'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  LogOut, 
  GraduationCap, 
  School, 
  Award, 
  TrendingUp,
  Users,
  FileText,
  MapPin,
  Star,
  BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockAuth, MockUser } from '@/lib/mock-auth'
import { SidebarLayout } from "@/components/sidebar-layout"

export default function DashboardPage() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const currentUser = mockAuth.getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  const handleSignOut = () => {
    mockAuth.logout()
    router.push('/')
  }

  // Animation variants
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

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.6,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p 
            className="text-slate-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Загрузка системы...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
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
              {/* <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Цифровой рейтинг школ</h1>
                <p className="text-sm text-slate-600">Панель управления</p>
              </div> */}
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-3"
                variants={itemVariants}
              >
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <motion.img 
                      className="h-10 w-10 rounded-full border-2 border-blue-200" 
                      src={user.avatar} 
                      alt={user.name || 'Пользователь'} 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <motion.div 
                      className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-200"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {user?.email}
                  </p>
                </div>
              </motion.div>
              
              <motion.button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Welcome Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Добро пожаловать, {user?.name?.split(' ')[0]}!
              </h2>
              <p className="text-slate-600">
                Обзор системы рейтинга образовательных учреждений на сегодня
              </p>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            variants={containerVariants}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              variants={statsVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <School className="h-6 w-6 text-blue-600" />
                  </motion.div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    Всего школ
                  </dt>
                  <motion.dd 
                    className="text-2xl font-bold text-slate-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    1,247
                  </motion.dd>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              variants={statsVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Award className="h-6 w-6 text-green-600" />
                  </motion.div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    Лидирующие школы
                  </dt>
                  <motion.dd 
                    className="text-2xl font-bold text-slate-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    156
                  </motion.dd>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              variants={statsVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users className="h-6 w-6 text-purple-600" />
                  </motion.div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    Учащиеся
                  </dt>
                  <motion.dd 
                    className="text-2xl font-bold text-slate-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    234,567
                  </motion.dd>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              variants={statsVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </motion.div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    Средний рейтинг
                  </dt>
                  <motion.dd 
                    className="text-2xl font-bold text-slate-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    4.2
                  </motion.dd>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions & Activity */}
          <motion.div 
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            variants={containerVariants}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-slate-200"
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg leading-6 font-semibold text-slate-900">
                  Быстрые действия
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Основные функции системы
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <motion.button 
                    className="w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(248 250 252)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-slate-900">
                        Анализ рейтингов
                      </span>
                    </div>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(248 250 252)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-slate-900">
                        Карта школ
                      </span>
                    </div>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(248 250 252)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-sm font-medium text-slate-900">
                        Отчеты
                      </span>
                    </div>
                  </motion.button>

                  <motion.button 
                    className="w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(248 250 252)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-slate-600 mr-3" />
                      <span className="text-sm font-medium text-slate-900">
                        Настройки системы
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-slate-200"
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg leading-6 font-semibold text-slate-900">
                  Последние обновления
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Активность в системе
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 font-medium">Обновлены рейтинги 15 школ</p>
                      <p className="text-xs text-slate-500">5 минут назад</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">Добавлена новая школа в систему</p>
                      <p className="text-xs text-slate-500">1 час назад</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">Сгенерирован отчет по региону</p>
                      <p className="text-xs text-slate-500">2 часа назад</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">Система успешно запущена</p>
                      <p className="text-xs text-slate-500">3 часа назад</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Top Schools Section */}
          <motion.div 
            className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg leading-6 font-semibold text-slate-900">
                Топ школы по рейтингу
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Лучшие образовательные учреждения региона
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Лицей №1 им. А.С. Пушкина", rating: 4.9, students: 1250, rank: 1 },
                  { name: "Гимназия №7", rating: 4.8, students: 980, rank: 2 },
                  { name: "Школа-интернат для одаренных детей", rating: 4.7, students: 650, rank: 3 }
                ].map((school, index) => (
                  <motion.div 
                    key={school.rank}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
                    whileHover={{ backgroundColor: "rgb(241 245 249)", scale: 1.01 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg font-bold text-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        {school.rank}
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{school.name}</p>
                        <p className="text-xs text-slate-500">{school.students} учащихся</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-slate-900">{school.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </SidebarLayout>
    </motion.div>
  )
}