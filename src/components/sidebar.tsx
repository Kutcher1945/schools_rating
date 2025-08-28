"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home, BarChart3, FileText, Trophy, MapPin, ChevronLeft, ChevronRight, 
  Menu, X, User, GraduationCap, Settings, Bell, Search, Sparkles,
  TrendingUp, Shield, Zap, Star, ArrowRight, ArrowLeft
} from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  className?: string
  defaultCollapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  badge?: string
  isNew?: boolean
  description?: string
  gradient?: string
}

const navItems: NavItem[] = [
  {
    title: "Главная",
    href: "/dashboard",
    icon: Home,
    iconColor: "text-red-500",
    description: "Общий обзор системы",
    gradient: "from-red-500 to-pink-500",
  },
  {
    title: "Рейтинг школ",
    href: "/rating",
    icon: Trophy,
    iconColor: "text-yellow-500",
    badge: "TOP",
    description: "Лучшие учебные заведения",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Организации образования",
    href: "/organizations",
    icon: FileText,
    iconColor: "text-purple-500",
    description: "Управление учреждениями",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    title: "Анализ рейтингов",
    href: "/analytics",
    icon: BarChart3,
    iconColor: "text-blue-500",
    isNew: true,
    description: "Детальная аналитика",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Карта школ",
    href: "/map",
    icon: MapPin,
    iconColor: "text-green-500",
    description: "Географическое размещение",
    gradient: "from-green-500 to-emerald-500",
  },
]

const quickActions = [
  { icon: Search, label: "Поиск", shortcut: "⌘K" },
  { icon: Bell, label: "Уведомления", count: 3 },
  { icon: Settings, label: "Настройки" },
]

export function Sidebar({ className, defaultCollapsed = false, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const logoVariants = {
    expanded: { scale: 1, rotate: 0 },
    collapsed: { scale: 0.8, rotate: 360 },
  }

  return (
    <>
      {/* Enhanced Mobile overlay with blur */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Premium Mobile menu button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed top-6 left-6 z-50 lg:hidden"
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl border border-white/20 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-110"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <motion.div
            animate={{ rotate: isMobileOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Enhanced Collapse Button - Positioned outside sidebar when collapsed */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="fixed left-20 top-6 z-30 hidden lg:block"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <motion.button
              onClick={handleCollapseToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative h-12 rounded-2xl transition-all duration-300",
                "bg-white/90 backdrop-blur-xl shadow-xl border border-white/20",
                "hover:bg-white hover:shadow-2xl",
                "flex items-center justify-center group overflow-hidden",
                isButtonHovered ? "w-32 px-4" : "w-12"
              )}
            >
              <motion.div
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                <AnimatePresence>
                  {isButtonHovered && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium text-slate-700 whitespace-nowrap"
                    >
                      Открыть
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Gradient background on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isButtonHovered ? 0.1 : 0 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl"
              />
            </motion.button>

            {/* Tooltip */}
            {!isButtonHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2"
              >
                <div className="bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shadow-lg">
                  Развернуть меню
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1">
                    <div className="w-2 h-2 bg-slate-800 rotate-45" />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Sidebar */}
      <motion.aside
        ref={sidebarRef}
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen",
          "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
          "backdrop-blur-xl border-r border-slate-700/50 shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-500 ease-out",
          className,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />
        
        <div className="relative flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-700/50">
            <motion.div
              variants={logoVariants}
              animate={isCollapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div> */}
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-s font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                      Цифровой рейтинг школ
                    </h2>
                    {/* <p className="text-xs text-slate-400 font-medium">Premium Analytics</p> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Collapse Button - Inside header when expanded */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all duration-300",
                      "bg-slate-800/60 hover:bg-slate-700 shadow-lg hover:shadow-xl",
                      "text-slate-300 hover:text-white hover:scale-110",
                      "border border-slate-600/30 relative group overflow-hidden"
                    )}
                    onClick={handleCollapseToggle}
                  >
                    <motion.div
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </motion.div>
                    
                    {/* Hover effect */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isButtonHovered ? 0.1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                    />
                  </Button>

                  {/* Tooltip for expanded state */}
                  {isButtonHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-2 right-0"
                    >
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shadow-lg border border-slate-700">
                        Свернуть меню
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
                          <div className="w-2 h-2 bg-slate-900 rotate-45" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions Bar */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 border-b border-slate-700/50"
              >
                <div className="flex gap-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-slate-300 hover:text-white flex-1 justify-center border border-slate-600/30"
                    >
                      <action.icon className="w-4 h-4 flex-shrink-0" />
                      {action.count && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {action.count}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Navigation */}
          <nav className={cn(
            "flex-1 py-6 space-y-2 overflow-y-auto",
            isCollapsed ? "px-2" : "px-4"
          )}>
            {navItems.map((item, i) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <motion.div
                  key={item.href}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                  onHoverStart={() => setHoveredItem(item.href)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-2xl transition-all duration-300 ease-out",
                      "group relative overflow-hidden",
                      isCollapsed ? "px-3 py-3.5 justify-center" : "gap-4 px-4 py-3.5",
                      isActive
                        ? "bg-slate-800 shadow-xl text-white scale-[1.02] border border-slate-600/30"
                        : "text-slate-300 hover:bg-slate-800/60 hover:shadow-lg hover:text-white",
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Icon with gradient background */}
                    <div className={cn(
                      "relative flex items-center justify-center rounded-xl transition-all duration-300",
                      isCollapsed ? "w-12 h-12" : "w-10 h-10",
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                        : "bg-slate-800/60 group-hover:bg-slate-700/80 shadow-sm group-hover:shadow-md border border-slate-600/30 group-hover:border-slate-500/50"
                    )}>
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-all duration-300 flex-shrink-0",
                          isActive ? "text-white" : isCollapsed ? item.iconColor : "text-slate-300",
                          "group-hover:scale-110 group-hover:text-white"
                        )}
                      />
                      
                      {/* New badge */}
                      {item.isNew && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "absolute w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm",
                            isCollapsed ? "-top-1 -right-1" : "-top-0.5 -right-0.5"
                          )}
                        >
                          <Zap className="w-2 h-2 text-white" />
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="flex-1 min-w-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{item.title}</span>
                            {item.badge && (
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm"
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Enhanced tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === item.href && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full ml-6 top-1/2 -translate-y-1/2 z-50"
                      >
                        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`}>
                              <Icon className="w-4 h-4 text-white flex-shrink-0" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{item.title}</p>
                              <p className="text-xs text-slate-300">{item.description}</p>
                            </div>
                          </div>
                          {item.badge && (
                            <span className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                              {item.badge}
                            </span>
                          )}
                          {/* Enhanced arrow */}
                          <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2">
                            <div className="w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Premium Footer with Stats */}
          <div className="border-t border-slate-700/50 p-6">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-sm text-slate-300">Статистика</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">245</div>
                      <div className="text-xs text-slate-400">Школы</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">98%</div>
                      <div className="text-xs text-slate-400">Рейтинг</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
                "bg-slate-800/60 hover:bg-slate-700 shadow-lg hover:shadow-xl cursor-pointer",
                "border border-slate-600/30"
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white flex-shrink-0" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Adilan Akhramovich</p>
                      <Shield className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Premium Account</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}