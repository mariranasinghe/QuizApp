"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Calculator,
  Clock,
  FileText,
  Book,
  Lightbulb,
  ArrowLeft,
  GraduationCap,
  SearchIcon,
} from "lucide-react"

interface AppLauncherProps {
  onClose: () => void
  onSelectApp: (appId: string) => void
}

export function AppLauncher({ onClose, onSelectApp }: AppLauncherProps) {
  const studyApps = [
    {
      id: "notes",
      name: "Notes",
      icon: <FileText className="h-8 w-8 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "flashcards",
      name: "Flashcards",
      icon: <BookOpen className="h-8 w-8 text-white" />,
      color: "bg-purple-500",
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <Calculator className="h-8 w-8 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "study-timer",
      name: "Study Timer",
      icon: <Clock className="h-8 w-8 text-white" />,
      color: "bg-yellow-500",
    },
    {
      id: "dictionary",
      name: "Dictionary",
      icon: <Book className="h-8 w-8 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "quiz-game",
      name: "Quiz Game",
      icon: <Lightbulb className="h-8 w-8 text-white" />,
      color: "bg-indigo-500",
    },
    {
      id: "research",
      name: "Research",
      icon: <SearchIcon className="h-8 w-8 text-white" />, // Using SearchIcon for Research
      color: "bg-cyan-500",
    },
    {
      id: "syllabus",
      name: "Syllabus",
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-2xl rounded-2xl bg-gray-900 text-white shadow-2xl">
        <CardHeader className="relative pb-4">
          <CardTitle className="text-center text-3xl font-bold">Study Apps</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to Quiz Selection</span>
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6 p-6">
          {studyApps.map((app) => (
            <div
              key={app.id}
              className="flex cursor-pointer flex-col items-center gap-2 p-2 transition-transform hover:scale-105"
              onClick={() => onSelectApp(app.id)}
            >
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-xl shadow-lg", app.color)}>
                {app.icon}
              </div>
              <span className="text-center text-sm font-medium text-gray-200">{app.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
