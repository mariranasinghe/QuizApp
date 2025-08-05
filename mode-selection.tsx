"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import QuizGame from "./quiz-game"
import { cn } from "@/lib/utils" // Import cn for conditional class names
import { LoginDialog } from "@/components/login-dialog" // Import the new LoginDialog
import { AppLauncher } from "@/components/app-launcher" // Import AppLauncher
import { NotesApp } from "@/components/notes-app" // Import NotesApp
import { LayoutGrid } from "lucide-react" // Import LayoutGrid icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import Tooltip components
import { FlashcardsApp } from "@/components/flashcards-app" // Import FlashcardsApp
import { CalculatorApp } from "@/components/calculator-app" // Import CalculatorApp
import { StudyTimerApp } from "@/components/study-timer-app" // Import StudyTimerApp
import { DictionaryApp } from "@/components/dictionary-app" // Import DictionaryApp

export type QuizMode = "normal" | "timed" | "survival" | "survival-practice"
export type QuizCategory =
  | "all"
  | "geography"
  | "science"
  | "history"
  | "pop culture"
  | "literature"
  | "philosophy"
  | "math"
  | "trivia"

interface GameStats {
  totalGames: number
  totalCorrectAnswers: number
  totalQuestionsAttempted: number
  highestScorePercentage: number
  survivalWins: number
  survivalLosses: number
}

const initialGameStats: GameStats = {
  totalGames: 0,
  totalCorrectAnswers: 0,
  totalQuestionsAttempted: 0,
  highestScorePercentage: 0,
  survivalWins: 0,
  survivalLosses: 0,
}

export default function ModeSelection() {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null)
  const [showSurvivalOptions, setShowSurvivalOptions] = useState(false)
  const [gameStats, setGameStats] = useState<GameStats>(initialGameStats)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [currentView, setCurrentView] = useState<
    | "quiz-selection"
    | "app-launcher"
    | "notes-app"
    | "flashcards-app"
    | "calculator-app"
    | "study-timer-app"
    | "dictionary-app"
  >("quiz-selection")
  const [selectedApp, setSelectedApp] = useState<string | null>(null) // To track which app is selected in launcher

  // Load stats from localStorage on mount
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem("quizGameStats")
      if (storedStats) {
        setGameStats(JSON.parse(storedStats))
      }
    } catch (error) {
      console.error("Failed to load game stats from localStorage:", error)
    }
  }, [])

  // Save stats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("quizGameStats", JSON.stringify(gameStats))
    } catch (error) {
      console.error("Failed to save game stats to localStorage:", error)
    }
  }, [gameStats])

  const handleQuitQuiz = () => {
    setSelectedCategory(null)
    setSelectedMode(null)
    setShowSurvivalOptions(false)
    setCurrentView("quiz-selection") // Go back to main quiz selection
  }

  const handleBackToModeSelection = () => {
    setSelectedMode(null)
    setShowSurvivalOptions(false)
    setCurrentView("quiz-selection") // Ensure we return to quiz selection if coming from survival options
  }

  const handleSelectMode = (mode: QuizMode) => {
    if (!selectedCategory) {
      alert("Please select a category first!")
      return
    }
    if (mode === "survival") {
      setShowSurvivalOptions(true)
    } else {
      setSelectedMode(mode)
    }
  }

  const handleStartSurvivalPractice = () => {
    setSelectedMode("survival-practice")
    setShowSurvivalOptions(false)
  }

  const handleStartSurvivalDirect = () => {
    setSelectedMode("survival")
    setShowSurvivalOptions(false)
  }

  const updateGameStats = useCallback((score: number, totalQuestions: number, mode: QuizMode, isWin?: boolean) => {
    setGameStats((prevStats) => {
      const newStats = { ...prevStats }
      newStats.totalGames += 1
      newStats.totalCorrectAnswers += score
      newStats.totalQuestionsAttempted += totalQuestions

      const currentScorePercentage = (score / totalQuestions) * 100
      if (currentScorePercentage > newStats.highestScorePercentage) {
        newStats.highestScorePercentage = currentScorePercentage
      }

      if (mode === "survival") {
        if (isWin) {
          newStats.survivalWins += 1
        } else {
          newStats.survivalLosses += 1
        }
      }
      return newStats
    })
  }, [])

  const handleSelectApp = (appId: string) => {
    if (appId === "quiz-game") {
      setCurrentView("quiz-selection")
      setSelectedApp(null)
    } else if (appId === "notes") {
      setSelectedApp("notes")
      setCurrentView("notes-app")
    } else if (appId === "flashcards") {
      setSelectedApp("flashcards")
      setCurrentView("flashcards-app")
    } else if (appId === "calculator") {
      setSelectedApp("calculator")
      setCurrentView("calculator-app")
    } else if (appId === "study-timer") {
      setSelectedApp("study-timer")
      setCurrentView("study-timer-app")
    } else if (appId === "dictionary") {
      // Add this condition
      setSelectedApp("dictionary")
      setCurrentView("dictionary-app")
    } else {
      alert(`Launching ${appId} (simulated)`)
      // For other apps, you might render different components or external links
    }
  }

  const handleCloseApp = () => {
    setSelectedApp(null)
    setCurrentView("app-launcher") // Return to app launcher after closing an app
  }

  // Render QuizGame if both category and mode are selected (and not in survival options)
  if (selectedMode && selectedCategory && !showSurvivalOptions && currentView === "quiz-selection") {
    return (
      <QuizGame
        mode={selectedMode}
        category={selectedCategory}
        onQuit={handleQuitQuiz}
        onQuizComplete={updateGameStats}
      />
    )
  }

  // Render Survival Options if triggered
  if (showSurvivalOptions && currentView === "quiz-selection") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-950 p-4">
        <Card className="w-full max-w-lg rounded-xl shadow-2xl bg-white dark:bg-gray-800">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-4xl font-extrabold text-gray-900 dark:text-gray-50">
              Survival Mode
            </CardTitle>
            <p className="text-center text-lg text-muted-foreground mt-2">Prepare for the ultimate challenge!</p>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div
              onClick={handleStartSurvivalPractice}
              className="group flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-950 shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-yellow-500 hover:shadow-xl hover:bg-yellow-100 dark:hover:bg-yellow-900"
            >
              <Button
                variant="ghost"
                className="w-full h-auto text-3xl font-bold text-yellow-800 dark:text-yellow-200 p-0 mb-2 group-hover:text-yellow-900 dark:group-hover:text-yellow-100"
              >
                Practice Session
              </Button>
              <p className="text-base text-yellow-600 dark:text-yellow-300 text-center group-hover:text-yellow-700 dark:group-hover:text-yellow-200">
                Try 5 hard questions. Get feedback on wrong answers.
              </p>
            </div>

            <div
              onClick={handleStartSurvivalDirect}
              className="group flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-950 shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-red-500 hover:shadow-xl hover:bg-red-100 dark:hover:bg-red-900"
            >
              <Button
                variant="ghost"
                className="w-full h-auto text-3xl font-bold text-red-800 dark:text-red-200 p-0 mb-2 group-hover:text-red-900 dark:group-hover:text-red-100"
              >
                Jump Straight In!
              </Button>
              <p className="text-base text-red-600 dark:text-red-300 text-center group-hover:text-red-700 dark:group-hover:text-red-200">
                One wrong answer, game over! No second chances.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button
              onClick={handleBackToModeSelection}
              variant="outline"
              className="w-full h-12 text-lg bg-transparent"
            >
              Back to Modes
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Render AppLauncher
  if (currentView === "app-launcher") {
    return <AppLauncher onClose={() => setCurrentView("quiz-selection")} onSelectApp={handleSelectApp} />
  }

  // Render NotesApp
  if (currentView === "notes-app" && selectedApp === "notes") {
    return <NotesApp onClose={handleCloseApp} />
  }

  // Render FlashcardsApp
  if (currentView === "flashcards-app" && selectedApp === "flashcards") {
    return <FlashcardsApp onClose={handleCloseApp} />
  }

  // Render CalculatorApp
  if (currentView === "calculator-app" && selectedApp === "calculator") {
    return <CalculatorApp onClose={handleCloseApp} />
  }

  // Render StudyTimerApp
  if (currentView === "study-timer-app" && selectedApp === "study-timer") {
    return <StudyTimerApp onClose={handleCloseApp} />
  }

  // Render DictionaryApp
  if (currentView === "dictionary-app" && selectedApp === "dictionary") {
    return <DictionaryApp onClose={handleCloseApp} />
  }

  const averageScorePercentage =
    gameStats.totalQuestionsAttempted > 0
      ? (gameStats.totalCorrectAnswers / gameStats.totalQuestionsAttempted) * 100
      : 0

  // Initial state: Side-by-side Category and Mode selection
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-950 p-4 relative">
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setCurrentView("app-launcher")} variant="secondary" size="icon">
                <LayoutGrid className="h-5 w-5" />
                <span className="sr-only">Apps</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Apps</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={() => setIsLoginDialogOpen(true)} variant="secondary">
          Sign In / Register
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl pt-16">
        {/* Category Selection Column */}
        <Card className="rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              Choose a Category
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 flex-grow">
            {[
              { name: "Geography", value: "geography", color: "blue", icon: "🌍" },
              { name: "Science", value: "science", color: "green", icon: "🔬" },
              { name: "History", value: "history", color: "purple", icon: "📜" },
              { name: "Pop Culture", value: "pop culture", color: "pink", icon: "🌟" },
              { name: "Literature", value: "literature", color: "indigo", icon: "📚" },
              { name: "Philosophy", value: "philosophy", color: "orange", icon: "🤔" },
              { name: "Math", value: "math", color: "teal", icon: "🔢" },
              { name: "Trivia", value: "trivia", color: "cyan", icon: "💡" },
              { name: "All Categories", value: "all", color: "gray", icon: "✨" },
            ].map((cat) => (
              <div
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as QuizCategory)}
                className={cn(
                  `group flex flex-col items-center p-4 rounded-lg border-2 shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg`,
                  `bg-${cat.color}-50 dark:bg-${cat.color}-950`,
                  `border-${cat.color}-200 dark:border-${cat.color}-700`,
                  selectedCategory === cat.value
                    ? `border-${cat.color}-500 ring-2 ring-${cat.color}-500`
                    : `hover:border-${cat.color}-500`,
                )}
              >
                <span
                  className={cn(
                    `text-xl font-bold flex items-center gap-2`, // Added flex and gap for icon
                    `text-${cat.color}-800 dark:text-${cat.color}-200`,
                    selectedCategory === cat.value
                      ? `text-${cat.color}-900 dark:text-${cat.color}-100`
                      : `group-hover:text-${cat.color}-900 dark:group-hover:text-${cat.color}-100`,
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span> {cat.name}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Mode Selection Column */}
        <Card className="rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              Choose a Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 flex-grow">
            {[
              {
                name: "Normal Mode",
                value: "normal",
                description: "No time limit, no sudden death.",
                color: "blue",
                icon: "😌",
              },
              {
                name: "Timed Mode",
                value: "timed",
                description: "Answer within a time limit per question.",
                color: "green",
                icon: "⏱️",
              },
              {
                name: "Survival Mode",
                value: "survival",
                description: "One wrong answer, game over!",
                color: "red",
                icon: "💀",
              },
            ].map((modeOption) => (
              <div
                key={modeOption.value}
                onClick={() => handleSelectMode(modeOption.value as QuizMode)}
                className={cn(
                  // Adjusted padding for shorter buttons
                  `group flex flex-col items-center py-3 px-4 rounded-lg border-2 shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg`,
                  `bg-${modeOption.color}-50 dark:bg-${modeOption.color}-950`,
                  `border-${modeOption.color}-200 dark:border-${modeOption.color}-700`,
                  !selectedCategory && "opacity-50 cursor-not-allowed", // Dim if no category selected
                  selectedMode === modeOption.value
                    ? `border-${modeOption.color}-500 ring-2 ring-${modeOption.color}-500`
                    : `hover:border-${modeOption.color}-500`,
                )}
              >
                <span
                  className={cn(
                    `text-xl font-bold flex items-center gap-2`, // Added flex and gap for icon
                    `text-${modeOption.color}-800 dark:text-${modeOption.color}-200`,
                    selectedMode === modeOption.value
                      ? `text-${modeOption.color}-900 dark:text-${modeOption.color}-100`
                      : `group-hover:text-${modeOption.color}-900 dark:group-hover:text-${modeOption.color}-100`,
                  )}
                >
                  <span className="text-2xl">{modeOption.icon}</span> {modeOption.name}
                </span>
                <p
                  className={cn(
                    // Changed from text-sm to text-base
                    `text-base text-center mt-1`,
                    `text-${modeOption.color}-600 dark:text-${modeOption.color}-300`,
                    selectedMode === modeOption.value
                      ? `text-${modeOption.color}-700 dark:text-${modeOption.color}-200`
                      : `group-hover:text-${modeOption.color}-700 dark:group-hover:text-${modeOption.color}-200`,
                  )}
                >
                  {modeOption.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Game Statistics Column */}
        <Card className="rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              Your Progress 📈
            </CardTitle>
            <p className="text-center text-lg text-muted-foreground mt-2">Overall game statistics</p>
          </CardHeader>
          <CardContent className="grid gap-4 flex-grow">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Total Quizzes Played:</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{gameStats.totalGames} 🎮</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Overall Accuracy:</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {averageScorePercentage.toFixed(1)}% 💪
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Highest Score:</span>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {gameStats.highestScorePercentage.toFixed(1)}% 🏆
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Survival Wins:</span>
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {gameStats.survivalWins} ✅
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Survival Losses:</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">{gameStats.survivalLosses} ❌</span>
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button
              onClick={() => setGameStats(initialGameStats)}
              variant="outline"
              className="w-full h-12 text-lg bg-transparent"
            >
              Reset Stats
            </Button>
          </CardFooter>
        </Card>
      </div>
      <LoginDialog isOpen={isLoginDialogOpen} onClose={() => setIsLoginDialogOpen(false)} />
    </div>
  )
}
