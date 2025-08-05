"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface StudyTimerAppProps {
  onClose: () => void
}

type SessionType = "work" | "shortBreak" | "longBreak"

const WORK_TIME = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60 // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60 // 15 minutes in seconds
const POMODOROS_BEFORE_LONG_BREAK = 4 // Long break after every 4 work sessions

// Helper to format time from seconds to MM:SS
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function StudyTimerApp({ onClose }: StudyTimerAppProps) {
  const [timeRemaining, setTimeRemaining] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<SessionType>("work")
  const [pomodoroCount, setPomodoroCount] = useState(0) // Completed work sessions
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true)
    }
  }, [isRunning])

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false)
    }
  }, [isRunning])

  const resetTimer = useCallback(() => {
    pauseTimer()
    if (sessionType === "work") {
      setTimeRemaining(WORK_TIME)
    } else if (sessionType === "shortBreak") {
      setTimeRemaining(SHORT_BREAK_TIME)
    } else {
      setTimeRemaining(LONG_BREAK_TIME)
    }
  }, [sessionType, pauseTimer])

  const switchSession = useCallback(
    (type: SessionType) => {
      pauseTimer()
      setSessionType(type)
      if (type === "work") {
        setTimeRemaining(WORK_TIME)
      } else if (type === "shortBreak") {
        setTimeRemaining(SHORT_BREAK_TIME)
      } else {
        setTimeRemaining(LONG_BREAK_TIME)
      }
    },
    [pauseTimer],
  )

  // Main timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      pauseTimer()
      // Play a sound or show a notification
      alert(`${sessionType === "work" ? "Work" : "Break"} session finished!`)

      if (sessionType === "work") {
        const newPomodoroCount = pomodoroCount + 1
        setPomodoroCount(newPomodoroCount)
        if (newPomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
          switchSession("longBreak")
        } else {
          switchSession("shortBreak")
        }
      } else {
        switchSession("work")
      }
      startTimer() // Automatically start the next session
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeRemaining, sessionType, pomodoroCount, pauseTimer, switchSession, startTimer])

  const getSessionColor = () => {
    switch (sessionType) {
      case "work":
        return "bg-red-500 dark:bg-red-700"
      case "shortBreak":
        return "bg-green-500 dark:bg-green-700"
      case "longBreak":
        return "bg-blue-500 dark:bg-blue-700"
      default:
        return "bg-gray-500 dark:bg-gray-700"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
        <CardHeader className="relative pb-4">
          <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
            Study Timer ⏰
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
            onClick={onClose}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to Apps</span>
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center p-6 pt-0">
          <div
            className={cn(
              "relative w-48 h-48 rounded-xl flex items-center justify-center text-white text-6xl font-bold mb-8 shadow-lg transition-colors duration-300",
              getSessionColor(),
            )}
          >
            {formatTime(timeRemaining)}
            <div className="absolute bottom-2 text-lg font-medium">
              {sessionType === "work" ? "Work Time" : sessionType === "shortBreak" ? "Short Break" : "Long Break"}
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => switchSession("work")}
              variant={sessionType === "work" ? "default" : "outline"}
              className={cn(
                "px-4 py-2 rounded-lg text-lg",
                sessionType === "work"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-transparent border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900",
              )}
            >
              Work
            </Button>
            <Button
              onClick={() => switchSession("shortBreak")}
              variant={sessionType === "shortBreak" ? "default" : "outline"}
              className={cn(
                "px-4 py-2 rounded-lg text-lg",
                sessionType === "shortBreak"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-transparent border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900",
              )}
            >
              Short Break
            </Button>
            <Button
              onClick={() => switchSession("longBreak")}
              variant={sessionType === "longBreak" ? "default" : "outline"}
              className={cn(
                "px-4 py-2 rounded-lg text-lg",
                sessionType === "longBreak"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-transparent border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900",
              )}
            >
              Long Break
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <Button onClick={startTimer} disabled={isRunning} className="h-14 w-14 rounded-full text-xl">
              <Play className="h-7 w-7" />
              <span className="sr-only">Start Timer</span>
            </Button>
            <Button onClick={pauseTimer} disabled={!isRunning} className="h-14 w-14 rounded-full text-xl">
              <Pause className="h-7 w-7" />
              <span className="sr-only">Pause Timer</span>
            </Button>
            <Button onClick={resetTimer} className="h-14 w-14 rounded-full text-xl">
              <RotateCcw className="h-7 w-7" />
              <span className="sr-only">Reset Timer</span>
            </Button>
          </div>

          <div className="text-center text-xl font-medium text-gray-700 dark:text-gray-300">
            Pomodoros Completed:
            <div className="mt-2 flex justify-center gap-1">
              {Array.from({ length: pomodoroCount }).map((_, i) => (
                <span key={i} className="text-3xl">
                  🍅
                </span>
              ))}
              {pomodoroCount === 0 && <span className="text-lg text-gray-500 dark:text-gray-400">None yet!</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
