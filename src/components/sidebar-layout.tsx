"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarLayoutProps {
  children: React.ReactNode
  className?: string
}

export function SidebarLayout({ children, className }: SidebarLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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


  return (
    <motion.div 
      className="flex h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      >
      <Sidebar defaultCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out flex flex-col transform-gpu",
          // sidebarCollapsed ? "lg:ml-16" : "lg:ml-64",
          className,
        )}
      >
        <div className="flex-1 overflow-auto bg-background transition-all duration-300 ease-in-out">
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">{children}</div>
        </div>
      </main>
    </motion.div>
  )
}
