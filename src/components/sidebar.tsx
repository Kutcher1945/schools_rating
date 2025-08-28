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
  TrendingUp, Shield, Zap, Star
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
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as any,
      },
    },
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
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Premium Sidebar */}
      <motion.aside
        ref={sidebarRef}
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen",
          "bg-gradient-to-br from-slate-50 via-white to-blue-50/30",
          "backdrop-blur-xl border-r border-white/20 shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-500 ease-out",
          className,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        <div className="relative flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
            <motion.div
              variants={logoVariants}
              animate={isCollapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      EduRank Pro
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Premium Analytics</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden lg:flex h-10 w-10 rounded-xl",
                "bg-white/60 hover:bg-white shadow-lg hover:shadow-xl",
                "text-slate-600 hover:text-slate-800",
                "transition-all duration-300 hover:scale-110",
                "border border-white/20"
              )}
              onClick={handleCollapseToggle}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>

          {/* Quick Actions Bar */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 border-b border-white/10"
              >
                <div className="flex gap-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-slate-600 hover:text-slate-800 flex-1 justify-center"
                    >
                      <action.icon className="w-4 h-4" />
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
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
                      "flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 ease-out",
                      "group relative overflow-hidden",
                      isActive
                        ? "bg-white shadow-xl text-slate-800 scale-[1.02]"
                        : "text-slate-600 hover:bg-white/70 hover:shadow-lg hover:text-slate-800",
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
                      "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                        : "bg-white/60 group-hover:bg-white shadow-sm group-hover:shadow-md"
                    )}>
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-all duration-300",
                          isActive ? "text-white" : item.iconColor,
                          "group-hover:scale-110"
                        )}
                      />
                      
                      {/* New badge */}
                      {item.isNew && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <Zap className="w-1.5 h-1.5 text-white" />
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
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Enhanced tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === item.href && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full ml-4 z-50"
                      >
                        <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
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
                            <div className="w-4 h-4 bg-slate-800 border-l border-t border-slate-700 rotate-45" />
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
          <div className="border-t border-white/10 p-6">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-sm text-slate-700">Статистика</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">245</div>
                      <div className="text-xs text-slate-500">Школы</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">98%</div>
                      <div className="text-xs text-slate-500">Рейтинг</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
                "bg-white/60 hover:bg-white shadow-lg hover:shadow-xl cursor-pointer",
                "border border-white/20"
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
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
                      <p className="text-sm font-bold text-slate-800">Adilan Akhramovich</p>
                      <Shield className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Premium Account</p>
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