"use client"

import type React from "react"
import Link from "next/link"
import { Brain, Heart, Home, LayoutDashboard, LogOut, Microscope, Settings, User2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="hidden md:flex fixed top-0 left-0 h-screen w-72 flex-col bg-gradient-to-b from-white to-gray-50 shadow-lg">
          <div className="flex h-full flex-col gap-2 p-6">
            <nav className="grid gap-2 text-sm">
              <Link
                href="/"
                className="flex items-center gap-3 text-xl font-semibold p-3 mb-6 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Microscope className="h-7 w-7" />
                <span>Detectly</span>
              </Link>

              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                  "hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1",
                  pathname === "/dashboard" ?
                    "bg-blue-50 text-blue-600 shadow-sm" :
                    "text-gray-600"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/dashboard/alzheimer"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                  "hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1",
                  pathname === "/dashboard/alzheimer" ?
                    "bg-purple-50 text-purple-600 shadow-sm" :
                    "text-gray-600"
                )}
              >
                <Brain className="h-5 w-5" />
                <span className="font-medium">Alzheimer's</span>
              </Link>

              <Link
                href="/dashboard/brain-tumor"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                  "hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1",
                  pathname === "/dashboard/brain-tumor" ?
                    "bg-indigo-50 text-indigo-600 shadow-sm" :
                    "text-gray-600"
                )}
              >
                <Brain className="h-5 w-5" />
                <span className="font-medium">Brain Tumor</span>
              </Link>

              <Link
                href="/dashboard/diabetic-retinopathy"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                  "hover:bg-emerald-50 hover:text-emerald-600 hover:translate-x-1",
                  pathname === "/dashboard/diabetic-retinopathy" ?
                    "bg-emerald-50 text-emerald-600 shadow-sm" :
                    "text-gray-600"
                )}
              >
                <Microscope className="h-5 w-5" />
                <span className="font-medium">Diabetic Retinopathy</span>
              </Link>

              <Link
                href="/dashboard/heart-disease"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                  "hover:bg-red-50 hover:text-red-600 hover:translate-x-1",
                  pathname === "/dashboard/heart-disease" ?
                    "bg-red-50 text-red-600 shadow-sm" :
                    "text-gray-600"
                )}
              >
                <Heart className="h-5 w-5" />
                <span className="font-medium">Heart Disease</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 rounded-xl border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex-1 ml-0 md:ml-72 min-h-screen overflow-y-auto bg-gray-50 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
