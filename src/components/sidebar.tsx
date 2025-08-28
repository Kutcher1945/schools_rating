"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, BarChart3, FileText, Trophy, MapPin, ChevronLeft, ChevronRight, Menu, X, User, GraduationCap } from "lucide-react"
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
}

const navItems: NavItem[] = [
  {
    title: "Главная",
    href: "/dashboard",
    icon: Home,
    iconColor: "text-red-500",
  },
  {
    title: "Рейтинг школ",
    href: "/rating",
    icon: Trophy,
    iconColor: "text-yellow-500",
  },
  {
    title: "Организации образования",
    href: "/organizations",
    icon: FileText,
    iconColor: "text-purple-500",
  },
  {
    title: "Анализ рейтингов",
    href: "/analytics",
    icon: BarChart3,
    iconColor: "text-blue-500",
  },
  {
    title: "Карта школ",
    href: "/map",
    icon: MapPin,
    iconColor: "text-green-500",
  },
]

export function Sidebar({ className, defaultCollapsed = false, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed)
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
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar/90 backdrop-blur-sm hover:bg-sidebar-accent transition-all duration-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border shadow-lg",
          "transition-all duration-500 ease-in-out transform",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        <motion.div 
          className="flex h-full flex-col bg-white"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-sidebar-foreground transition-opacity duration-300">
                Sidebar
              </h2>
              // <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md">
              //   <GraduationCap className="w-5 h-5 text-white" />
              // </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden lg:flex h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "transition-all duration-200 hover:scale-105",
              )}
              onClick={handleCollapseToggle}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300 ease-in-out",
                    "group relative hover:scale-[1.02] hover:shadow-sm",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "transform-gpu", // Hardware acceleration for smoother animations
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-all duration-300",
                      isActive ? "text-sidebar-primary-foreground" : item.iconColor,
                      "group-hover:scale-110",
                    )}
                  />

                  <span
                    className={cn(
                      "flex-1 text-sm font-medium transition-all duration-300",
                      isCollapsed ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0",
                    )}
                  >
                    {item.title}
                  </span>

                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-1 text-xs transition-all duration-300",
                        isActive
                          ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                          : "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Enhanced tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 hidden group-hover:block z-50 animate-in fade-in-0 slide-in-from-left-1 duration-200">
                      <div className="rounded-lg bg-sidebar-foreground px-3 py-2 text-sm text-sidebar shadow-lg border border-sidebar-border">
                        {item.title}
                        {item.badge && (
                          <span className="ml-2 rounded-full bg-sidebar-accent px-2 py-0.5 text-xs text-sidebar-accent-foreground">
                            {item.badge}
                          </span>
                        )}
                        {/* Tooltip arrow */}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-sidebar-foreground" />
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 bg-sidebar/30">
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                "hover:bg-sidebar-accent rounded-lg p-2 cursor-pointer",
              )}
            >
              <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <User className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div
                className={cn(
                  "flex-1 min-w-0 transition-all duration-300",
                  isCollapsed ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0",
                )}
              >
                <p className="text-sm font-medium text-sidebar-foreground truncate">Adilan Akhramovich</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">demo@example.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  )
}
